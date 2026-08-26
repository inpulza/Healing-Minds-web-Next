CREATE TYPE "public"."web_alert_status" AS ENUM('pending', 'sent', 'failed', 'unknown', 'disabled');--> statement-breakpoint
CREATE TABLE "web_alert_outbox" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"dedupe_key" text NOT NULL,
	"tenant_id" text NOT NULL,
	"form_key" text NOT NULL,
	"lead_id" varchar NOT NULL,
	"status" "web_alert_status" DEFAULT 'pending' NOT NULL,
	"attempts" integer DEFAULT 0 NOT NULL,
	"zernio_message_id" text,
	"last_error_code" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "chk_web_alert_outbox_attempts" CHECK ("web_alert_outbox"."attempts" >= 0)
);
--> statement-breakpoint
ALTER TABLE "web_alert_outbox" ADD CONSTRAINT "web_alert_outbox_lead_id_contact_messages_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."contact_messages"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "uq_web_alert_outbox_dedupe_key" ON "web_alert_outbox" USING btree ("dedupe_key");--> statement-breakpoint
CREATE INDEX "idx_web_alert_outbox_status_created" ON "web_alert_outbox" USING btree ("status","created_at");--> statement-breakpoint
CREATE INDEX "idx_web_alert_outbox_lead_id" ON "web_alert_outbox" USING btree ("lead_id");