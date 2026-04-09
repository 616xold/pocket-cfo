CREATE TYPE "public"."finance_twin_extractor_key" AS ENUM('trial_balance_csv');--> statement-breakpoint
CREATE TYPE "public"."finance_twin_lineage_target_kind" AS ENUM('reporting_period', 'ledger_account', 'trial_balance_line');--> statement-breakpoint
CREATE TYPE "public"."finance_twin_sync_run_status" AS ENUM('running', 'succeeded', 'failed');--> statement-breakpoint
CREATE TABLE "finance_companies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_key" text NOT NULL,
	"display_name" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "finance_ledger_accounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid NOT NULL,
	"account_code" text NOT NULL,
	"account_name" text NOT NULL,
	"account_type" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "finance_reporting_periods" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid NOT NULL,
	"period_key" text NOT NULL,
	"label" text NOT NULL,
	"period_start" date,
	"period_end" date NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "finance_trial_balance_lines" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid NOT NULL,
	"reporting_period_id" uuid NOT NULL,
	"ledger_account_id" uuid NOT NULL,
	"sync_run_id" uuid NOT NULL,
	"line_number" integer NOT NULL,
	"debit_amount" numeric(18, 2) NOT NULL,
	"credit_amount" numeric(18, 2) NOT NULL,
	"net_amount" numeric(18, 2) NOT NULL,
	"currency_code" text,
	"observed_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "finance_twin_lineage" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid NOT NULL,
	"sync_run_id" uuid NOT NULL,
	"target_kind" "finance_twin_lineage_target_kind" NOT NULL,
	"target_id" uuid NOT NULL,
	"source_id" uuid NOT NULL,
	"source_snapshot_id" uuid NOT NULL,
	"source_file_id" uuid NOT NULL,
	"recorded_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "finance_twin_sync_runs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid NOT NULL,
	"reporting_period_id" uuid,
	"source_id" uuid NOT NULL,
	"source_snapshot_id" uuid NOT NULL,
	"source_file_id" uuid NOT NULL,
	"extractor_key" "finance_twin_extractor_key" NOT NULL,
	"status" "finance_twin_sync_run_status" NOT NULL,
	"started_at" timestamp with time zone NOT NULL,
	"completed_at" timestamp with time zone,
	"stats" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"error_summary" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "finance_ledger_accounts" ADD CONSTRAINT "finance_ledger_accounts_company_id_finance_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."finance_companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "finance_reporting_periods" ADD CONSTRAINT "finance_reporting_periods_company_id_finance_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."finance_companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "finance_trial_balance_lines" ADD CONSTRAINT "finance_trial_balance_lines_company_id_finance_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."finance_companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "finance_trial_balance_lines" ADD CONSTRAINT "finance_trial_balance_lines_reporting_period_id_finance_reporting_periods_id_fk" FOREIGN KEY ("reporting_period_id") REFERENCES "public"."finance_reporting_periods"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "finance_trial_balance_lines" ADD CONSTRAINT "finance_trial_balance_lines_ledger_account_id_finance_ledger_accounts_id_fk" FOREIGN KEY ("ledger_account_id") REFERENCES "public"."finance_ledger_accounts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "finance_trial_balance_lines" ADD CONSTRAINT "finance_trial_balance_lines_sync_run_id_finance_twin_sync_runs_id_fk" FOREIGN KEY ("sync_run_id") REFERENCES "public"."finance_twin_sync_runs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "finance_twin_lineage" ADD CONSTRAINT "finance_twin_lineage_company_id_finance_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."finance_companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "finance_twin_lineage" ADD CONSTRAINT "finance_twin_lineage_sync_run_id_finance_twin_sync_runs_id_fk" FOREIGN KEY ("sync_run_id") REFERENCES "public"."finance_twin_sync_runs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "finance_twin_lineage" ADD CONSTRAINT "finance_twin_lineage_source_id_sources_id_fk" FOREIGN KEY ("source_id") REFERENCES "public"."sources"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "finance_twin_lineage" ADD CONSTRAINT "finance_twin_lineage_source_snapshot_id_source_snapshots_id_fk" FOREIGN KEY ("source_snapshot_id") REFERENCES "public"."source_snapshots"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "finance_twin_lineage" ADD CONSTRAINT "finance_twin_lineage_source_file_id_source_files_id_fk" FOREIGN KEY ("source_file_id") REFERENCES "public"."source_files"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "finance_twin_sync_runs" ADD CONSTRAINT "finance_twin_sync_runs_company_id_finance_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."finance_companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "finance_twin_sync_runs" ADD CONSTRAINT "finance_twin_sync_runs_reporting_period_id_finance_reporting_periods_id_fk" FOREIGN KEY ("reporting_period_id") REFERENCES "public"."finance_reporting_periods"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "finance_twin_sync_runs" ADD CONSTRAINT "finance_twin_sync_runs_source_id_sources_id_fk" FOREIGN KEY ("source_id") REFERENCES "public"."sources"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "finance_twin_sync_runs" ADD CONSTRAINT "finance_twin_sync_runs_source_snapshot_id_source_snapshots_id_fk" FOREIGN KEY ("source_snapshot_id") REFERENCES "public"."source_snapshots"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "finance_twin_sync_runs" ADD CONSTRAINT "finance_twin_sync_runs_source_file_id_source_files_id_fk" FOREIGN KEY ("source_file_id") REFERENCES "public"."source_files"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "finance_companies_company_key_key" ON "finance_companies" USING btree ("company_key");--> statement-breakpoint
CREATE UNIQUE INDEX "finance_ledger_accounts_company_account_code_key" ON "finance_ledger_accounts" USING btree ("company_id","account_code");--> statement-breakpoint
CREATE INDEX "finance_ledger_accounts_company_id_idx" ON "finance_ledger_accounts" USING btree ("company_id");--> statement-breakpoint
CREATE UNIQUE INDEX "finance_reporting_periods_company_period_key_key" ON "finance_reporting_periods" USING btree ("company_id","period_key");--> statement-breakpoint
CREATE INDEX "finance_reporting_periods_company_period_end_idx" ON "finance_reporting_periods" USING btree ("company_id","period_end");--> statement-breakpoint
CREATE UNIQUE INDEX "finance_trial_balance_lines_sync_run_ledger_account_key" ON "finance_trial_balance_lines" USING btree ("sync_run_id","ledger_account_id");--> statement-breakpoint
CREATE INDEX "finance_trial_balance_lines_company_period_idx" ON "finance_trial_balance_lines" USING btree ("company_id","reporting_period_id");--> statement-breakpoint
CREATE UNIQUE INDEX "finance_twin_lineage_sync_run_target_key" ON "finance_twin_lineage" USING btree ("sync_run_id","target_kind","target_id");--> statement-breakpoint
CREATE INDEX "finance_twin_lineage_target_lookup_idx" ON "finance_twin_lineage" USING btree ("target_kind","target_id");--> statement-breakpoint
CREATE INDEX "finance_twin_lineage_source_snapshot_id_idx" ON "finance_twin_lineage" USING btree ("source_snapshot_id");--> statement-breakpoint
CREATE INDEX "finance_twin_sync_runs_company_id_idx" ON "finance_twin_sync_runs" USING btree ("company_id","created_at");--> statement-breakpoint
CREATE INDEX "finance_twin_sync_runs_source_file_id_idx" ON "finance_twin_sync_runs" USING btree ("source_file_id","created_at");