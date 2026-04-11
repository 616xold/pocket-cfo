ALTER TYPE "public"."finance_twin_extractor_key" ADD VALUE IF NOT EXISTS 'general_ledger_csv';--> statement-breakpoint
ALTER TYPE "public"."finance_twin_lineage_target_kind" ADD VALUE IF NOT EXISTS 'journal_entry';--> statement-breakpoint
ALTER TYPE "public"."finance_twin_lineage_target_kind" ADD VALUE IF NOT EXISTS 'journal_line';--> statement-breakpoint
CREATE TABLE "finance_journal_entries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid NOT NULL,
	"sync_run_id" uuid NOT NULL,
	"external_entry_id" text NOT NULL,
	"transaction_date" date NOT NULL,
	"entry_description" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "finance_journal_lines" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid NOT NULL,
	"journal_entry_id" uuid NOT NULL,
	"ledger_account_id" uuid NOT NULL,
	"sync_run_id" uuid NOT NULL,
	"line_number" integer NOT NULL,
	"debit_amount" numeric(18, 2) NOT NULL,
	"credit_amount" numeric(18, 2) NOT NULL,
	"currency_code" text,
	"line_description" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "finance_ledger_accounts" ALTER COLUMN "account_name" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "finance_journal_entries" ADD CONSTRAINT "finance_journal_entries_company_id_finance_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."finance_companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "finance_journal_entries" ADD CONSTRAINT "finance_journal_entries_sync_run_id_finance_twin_sync_runs_id_fk" FOREIGN KEY ("sync_run_id") REFERENCES "public"."finance_twin_sync_runs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "finance_journal_lines" ADD CONSTRAINT "finance_journal_lines_company_id_finance_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."finance_companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "finance_journal_lines" ADD CONSTRAINT "finance_journal_lines_journal_entry_id_finance_journal_entries_id_fk" FOREIGN KEY ("journal_entry_id") REFERENCES "public"."finance_journal_entries"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "finance_journal_lines" ADD CONSTRAINT "finance_journal_lines_ledger_account_id_finance_ledger_accounts_id_fk" FOREIGN KEY ("ledger_account_id") REFERENCES "public"."finance_ledger_accounts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "finance_journal_lines" ADD CONSTRAINT "finance_journal_lines_sync_run_id_finance_twin_sync_runs_id_fk" FOREIGN KEY ("sync_run_id") REFERENCES "public"."finance_twin_sync_runs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "finance_journal_entries_sync_run_external_entry_key" ON "finance_journal_entries" USING btree ("sync_run_id","external_entry_id");--> statement-breakpoint
CREATE INDEX "finance_journal_entries_company_sync_idx" ON "finance_journal_entries" USING btree ("company_id","sync_run_id");--> statement-breakpoint
CREATE INDEX "finance_journal_entries_company_date_idx" ON "finance_journal_entries" USING btree ("company_id","transaction_date");--> statement-breakpoint
CREATE UNIQUE INDEX "finance_journal_lines_sync_run_line_number_key" ON "finance_journal_lines" USING btree ("sync_run_id","line_number");--> statement-breakpoint
CREATE INDEX "finance_journal_lines_journal_entry_id_idx" ON "finance_journal_lines" USING btree ("journal_entry_id","line_number");--> statement-breakpoint
CREATE INDEX "finance_journal_lines_company_sync_idx" ON "finance_journal_lines" USING btree ("company_id","sync_run_id");
