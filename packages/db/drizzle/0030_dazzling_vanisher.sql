ALTER TYPE "public"."mission_source_kind" ADD VALUE 'manual_reporting' BEFORE 'github_issue';--> statement-breakpoint
ALTER TYPE "public"."mission_type" ADD VALUE 'reporting';--> statement-breakpoint
ALTER TYPE "public"."artifact_kind" ADD VALUE 'finance_memo' BEFORE 'pr_link';--> statement-breakpoint
ALTER TYPE "public"."artifact_kind" ADD VALUE 'evidence_appendix' BEFORE 'pr_link';