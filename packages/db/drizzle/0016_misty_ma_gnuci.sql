CREATE TYPE "public"."source_ingest_run_status" AS ENUM('queued', 'processing', 'ready', 'failed');--> statement-breakpoint
CREATE TYPE "public"."source_parser_key" AS ENUM('csv_tabular', 'markdown_text', 'zip_inventory', 'metadata_fallback');--> statement-breakpoint
CREATE TABLE "source_ingest_runs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"source_id" uuid NOT NULL,
	"source_snapshot_id" uuid NOT NULL,
	"source_file_id" uuid NOT NULL,
	"parser_key" "source_parser_key" NOT NULL,
	"parser_selection" jsonb NOT NULL,
	"input_checksum_sha256" text NOT NULL,
	"storage_kind" "source_snapshot_storage_kind" NOT NULL,
	"storage_ref" text NOT NULL,
	"status" "source_ingest_run_status" DEFAULT 'queued' NOT NULL,
	"warnings" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"errors" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"receipt_summary" jsonb,
	"started_at" timestamp with time zone NOT NULL,
	"completed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "source_ingest_runs" ADD CONSTRAINT "source_ingest_runs_source_id_sources_id_fk" FOREIGN KEY ("source_id") REFERENCES "public"."sources"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "source_ingest_runs" ADD CONSTRAINT "source_ingest_runs_source_snapshot_id_source_snapshots_id_fk" FOREIGN KEY ("source_snapshot_id") REFERENCES "public"."source_snapshots"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "source_ingest_runs" ADD CONSTRAINT "source_ingest_runs_source_file_id_source_files_id_fk" FOREIGN KEY ("source_file_id") REFERENCES "public"."source_files"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "source_ingest_runs_source_file_id_idx" ON "source_ingest_runs" USING btree ("source_file_id","created_at");--> statement-breakpoint
CREATE INDEX "source_ingest_runs_source_id_idx" ON "source_ingest_runs" USING btree ("source_id","created_at");