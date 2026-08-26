import { NextResponse, type NextRequest } from "next/server";
import { ZodError } from "zod";
import {
  contactFormRequestSchema,
  contactMessages,
  insertContactMessageSchema,
} from "@shared/schema";
import { emailService } from "../../../server/services/email";
import { checkRateLimit } from "../../../server/services/rate-limiter";
import { evaluateContactSubmission } from "../../../server/services/spam-filter";
import { dispatchContactWebAlert } from "../../../server/web-alerts/contact-alert";
import { createDrizzleWebAlertStore } from "../../../server/web-alerts/store";

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
    const [contactMessage] = await db
      .insert(contactMessages)
      .values(validatedData)
      .returning({ id: contactMessages.id });

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

    try {
      await dispatchContactWebAlert({
        leadId: contactMessage.id,
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
      // The WhatsApp alert is secondary. Never expose patient data or turn an
      // already-persisted lead into a failed browser submission.
      console.error("Contact WhatsApp alert failed after durable persistence");
    }

    return NextResponse.json({
      success: true,
      message: "Contact message received successfully",
      id: contactMessage.id,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return errorResponse(400, "Invalid form data");
    }
    console.error("Contact form processing failed", error);
    return errorResponse(500, "Internal server error");
  }
}
