import { randomUUID } from "node:crypto";
import { after, NextResponse, type NextRequest } from "next/server";
import { ZodError } from "zod";
import {
  contactFormRequestSchema,
  contactMessages,
  insertContactMessageSchema,
  webAlertOutbox,
} from "@shared/schema";
import { emailService } from "../../../server/services/email";
import { checkRateLimit } from "../../../server/services/rate-limiter";
import { evaluateContactSubmission } from "../../../server/services/spam-filter";
import { dispatchContactWebAlert } from "../../../server/web-alerts/contact-alert";
import { createDrizzleWebAlertStore } from "../../../server/web-alerts/store";
import { readZernioConfig } from "../../../server/web-alerts/zernio";

export const runtime = "nodejs";

type ErrorBody = { success: false; message: string };

function errorResponse(status: number, message: string, headers?: HeadersInit) {
  return NextResponse.json<ErrorBody>({ success: false, message }, { status, headers });
}

function clientIp(request: NextRequest): string {
  return (
    request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

export async function POST(request: NextRequest) {
  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return errorResponse(400, "Invalid JSON body");
  }

  const email =
    rawBody && typeof rawBody === "object" && typeof (rawBody as Record<string, unknown>).email === "string"
      ? String((rawBody as Record<string, unknown>).email)
      : undefined;
  const rateLimit = checkRateLimit(clientIp(request), email);
  if (!rateLimit.allowed) {
    return errorResponse(429, "Too many requests. Please try again later.", {
      "Retry-After": String(rateLimit.retryAfterSec ?? 60),
    });
  }

  try {
    const submission = contactFormRequestSchema.parse(rawBody);
    const verdict = await evaluateContactSubmission(submission);
    if (verdict.spam) {
      console.warn("Contact submission filtered", {
        reason: verdict.reason || "unknown",
      });
      return NextResponse.json({ success: true, filtered: true }, { status: 202 });
    }

    const validatedData = insertContactMessageSchema.parse({
      firstName: submission.firstName,
      lastName: submission.lastName,
      email: submission.email,
      phone: submission.phone,
      preferredLanguage: submission.preferredLanguage,
      message: submission.message,
    });

    if (!process.env.DATABASE_URL) {
      console.error("Contact persistence unavailable: DATABASE_URL is not configured");
      return errorResponse(503, "Contact service is temporarily unavailable");
    }

    // Import lazily so builds and static routes do not establish a database connection.
    const { db } = await import("../../../server/db");
    const leadId = submission.submissionId || randomUUID();
    const outboxId = randomUUID();
    const alertEnabled = readZernioConfig().enabled;
    const created = await db.transaction(async (tx) => {
      const [inserted] = await tx
        .insert(contactMessages)
        .values({ ...validatedData, id: leadId })
        .onConflictDoNothing({ target: contactMessages.id })
        .returning({ id: contactMessages.id });
      if (!inserted) return false;
      await tx.insert(webAlertOutbox).values({
        id: outboxId,
        dedupeKey: `healing-minds:${submission.formKey}:${leadId}`,
        tenantId: "healing-minds",
        formKey: submission.formKey,
        leadId,
        status: alertEnabled ? "pending" : "disabled",
      });
      return true;
    });

    if (!created) {
      return NextResponse.json({
        success: true,
        message: "Contact message already received",
        id: leadId,
        duplicate: true,
      });
    }

    try {
      await Promise.all([
        emailService.sendContactNotification(validatedData, {
          test: process.env.NODE_ENV !== "production",
        }),
        emailService.sendConfirmationEmail(validatedData),
      ]);
    } catch (error) {
      console.error("Contact email delivery failed after durable persistence", error);
    }

    if (alertEnabled) after(async () => {
      try {
        await dispatchContactWebAlert({
          outboxId,
          leadId,
          formKey: submission.formKey,
          lead: {
            firstName: submission.firstName,
            lastName: submission.lastName,
            phone: submission.phone,
            message: submission.message,
          },
        }, {
          store: createDrizzleWebAlertStore(db),
        });
      } catch {
        // The durable pending row remains available to the protected retry worker.
        console.error("Contact WhatsApp alert deferred after durable persistence");
      }
    });

    return NextResponse.json({
      success: true,
      message: "Contact message received successfully",
      id: leadId,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return errorResponse(400, "Invalid form data");
    }
    console.error("Contact form processing failed", error);
    return errorResponse(500, "Internal server error");
  }
}
