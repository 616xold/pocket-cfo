ALTER TYPE "public"."finance_twin_lineage_target_kind" ADD VALUE 'general_ledger_balance_proof';--> statement-breakpoint
CREATE TABLE "finance_general_ledger_balance_proofs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid NOT NULL,
	"ledger_account_id" uuid NOT NULL,
	"sync_run_id" uuid NOT NULL,
	"opening_balance_amount" numeric(18, 2),
	"opening_balance_source_column" text,
	"opening_balance_line_number" integer,
	"ending_balance_amount" numeric(18, 2),
	"ending_balance_source_column" text,
	"ending_balance_line_number" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "finance_general_ledger_balance_proofs" ADD CONSTRAINT "finance_general_ledger_balance_proofs_company_id_finance_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."finance_companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "finance_general_ledger_balance_proofs" ADD CONSTRAINT "finance_general_ledger_balance_proofs_ledger_account_id_finance_ledger_accounts_id_fk" FOREIGN KEY ("ledger_account_id") REFERENCES "public"."finance_ledger_accounts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "finance_general_ledger_balance_proofs" ADD CONSTRAINT "finance_general_ledger_balance_proofs_sync_run_id_finance_twin_sync_runs_id_fk" FOREIGN KEY ("sync_run_id") REFERENCES "public"."finance_twin_sync_runs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "finance_general_ledger_balance_proofs_sync_run_ledger_account_key" ON "finance_general_ledger_balance_proofs" USING btree ("sync_run_id","ledger_account_id");--> statement-breakpoint
CREATE INDEX "finance_general_ledger_balance_proofs_company_sync_idx" ON "finance_general_ledger_balance_proofs" USING btree ("company_id","sync_run_id");--> statement-breakpoint
CREATE INDEX "finance_general_ledger_balance_proofs_ledger_account_idx" ON "finance_general_ledger_balance_proofs" USING btree ("ledger_account_id");