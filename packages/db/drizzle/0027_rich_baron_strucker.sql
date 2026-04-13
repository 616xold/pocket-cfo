CREATE TYPE "public"."cfo_wiki_document_extract_status" AS ENUM('extracted', 'unsupported', 'failed');--> statement-breakpoint
CREATE TYPE "public"."cfo_wiki_document_kind" AS ENUM('markdown_text', 'plain_text', 'pdf_text', 'unsupported_document');--> statement-breakpoint
CREATE TYPE "public"."cfo_wiki_document_role" AS ENUM('general_document', 'policy_document', 'board_material', 'lender_document');--> statement-breakpoint
ALTER TYPE "public"."cfo_wiki_page_kind" ADD VALUE 'source_digest';--> statement-breakpoint
CREATE TABLE "cfo_wiki_document_extracts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid NOT NULL,
	"source_id" uuid NOT NULL,
	"source_snapshot_id" uuid NOT NULL,
	"source_file_id" uuid,
	"extract_status" "cfo_wiki_document_extract_status" NOT NULL,
	"document_kind" "cfo_wiki_document_kind" NOT NULL,
	"title" text,
	"heading_outline" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"excerpt_blocks" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"extracted_text" text,
	"rendered_markdown" text,
	"warnings" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"error_summary" text,
	"parser_version" text NOT NULL,
	"input_checksum_sha256" text NOT NULL,
	"extracted_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cfo_wiki_source_bindings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid NOT NULL,
	"source_id" uuid NOT NULL,
	"include_in_compile" boolean DEFAULT true NOT NULL,
	"document_role" "cfo_wiki_document_role",
	"bound_by" text DEFAULT 'operator' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "cfo_wiki_document_extracts" ADD CONSTRAINT "cfo_wiki_document_extracts_company_id_finance_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."finance_companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cfo_wiki_document_extracts" ADD CONSTRAINT "cfo_wiki_document_extracts_source_id_sources_id_fk" FOREIGN KEY ("source_id") REFERENCES "public"."sources"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cfo_wiki_document_extracts" ADD CONSTRAINT "cfo_wiki_document_extracts_source_snapshot_id_source_snapshots_id_fk" FOREIGN KEY ("source_snapshot_id") REFERENCES "public"."source_snapshots"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cfo_wiki_document_extracts" ADD CONSTRAINT "cfo_wiki_document_extracts_source_file_id_source_files_id_fk" FOREIGN KEY ("source_file_id") REFERENCES "public"."source_files"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cfo_wiki_source_bindings" ADD CONSTRAINT "cfo_wiki_source_bindings_company_id_finance_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."finance_companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cfo_wiki_source_bindings" ADD CONSTRAINT "cfo_wiki_source_bindings_source_id_sources_id_fk" FOREIGN KEY ("source_id") REFERENCES "public"."sources"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "cfo_wiki_document_extracts_company_snapshot_key" ON "cfo_wiki_document_extracts" USING btree ("company_id","source_snapshot_id");--> statement-breakpoint
CREATE INDEX "cfo_wiki_document_extracts_company_source_idx" ON "cfo_wiki_document_extracts" USING btree ("company_id","source_id");--> statement-breakpoint
CREATE INDEX "cfo_wiki_document_extracts_company_status_idx" ON "cfo_wiki_document_extracts" USING btree ("company_id","extract_status");--> statement-breakpoint
CREATE UNIQUE INDEX "cfo_wiki_source_bindings_company_source_key" ON "cfo_wiki_source_bindings" USING btree ("company_id","source_id");--> statement-breakpoint
CREATE INDEX "cfo_wiki_source_bindings_company_include_idx" ON "cfo_wiki_source_bindings" USING btree ("company_id","include_in_compile");