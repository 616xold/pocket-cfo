CREATE TYPE "public"."mission_source_kind" AS ENUM('manual_text', 'github_issue', 'github_comment', 'alert', 'voice_note', 'screenshot');--> statement-breakpoint
CREATE TYPE "public"."mission_status" AS ENUM('draft', 'planned', 'queued', 'running', 'awaiting_approval', 'succeeded', 'failed', 'cancelled', 'paused');--> statement-breakpoint
CREATE TYPE "public"."mission_task_role" AS ENUM('planner', 'scout', 'executor', 'reviewer', 'sre');--> statement-breakpoint
CREATE TYPE "public"."mission_task_status" AS ENUM('pending', 'claimed', 'running', 'blocked', 'awaiting_approval', 'succeeded', 'failed', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."mission_type" AS ENUM('build', 'incident', 'release', 'discovery');--> statement-breakpoint
CREATE TYPE "public"."approval_kind" AS ENUM('command', 'file_change', 'merge', 'deploy', 'rollback', 'network_escalation');--> statement-breakpoint
CREATE TYPE "public"."approval_status" AS ENUM('pending', 'approved', 'declined', 'cancelled', 'expired');--> statement-breakpoint
CREATE TYPE "public"."artifact_kind" AS ENUM('plan', 'pr_link', 'diff_summary', 'test_report', 'screenshot', 'benchmark_report', 'metrics_delta', 'rollback_note', 'approval_card', 'proof_bundle_manifest', 'replay_bundle', 'log_excerpt');--> statement-breakpoint
CREATE TYPE "public"."outbox_status" AS ENUM('pending', 'processing', 'delivered', 'failed');--> statement-breakpoint
CREATE TYPE "public"."replay_event_type" AS ENUM('mission.created', 'mission.status_changed', 'task.created', 'task.status_changed', 'artifact.created', 'approval.requested', 'approval.resolved', 'runtime.thread_started', 'runtime.turn_started', 'runtime.item_started', 'runtime.item_completed');--> statement-breakpoint
CREATE TYPE "public"."twin_entity_type" AS ENUM('repository', 'service', 'package', 'owner', 'testSuite', 'ciJob', 'runbook', 'dashboard', 'flag', 'doc');--> statement-breakpoint
CREATE TYPE "public"."twin_freshness_status" AS ENUM('fresh', 'stale', 'unknown');--> statement-breakpoint
CREATE TABLE "mission_inputs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"mission_id" uuid NOT NULL,
	"raw_text" text NOT NULL,
	"compiler_name" text NOT NULL,
	"compiler_version" text DEFAULT '0.1.0' NOT NULL,
	"compiler_confidence" integer DEFAULT 0 NOT NULL,
	"compiler_output" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "mission_tasks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"mission_id" uuid NOT NULL,
	"role" "mission_task_role" NOT NULL,
	"sequence" integer NOT NULL,
	"status" "mission_task_status" NOT NULL,
	"depends_on_task_id" uuid,
	"codex_thread_id" text,
	"workspace_id" uuid,
	"summary" text,
	"attempt_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "missions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" "mission_type" NOT NULL,
	"status" "mission_status" NOT NULL,
	"title" text NOT NULL,
	"objective" text NOT NULL,
	"source_kind" "mission_source_kind" NOT NULL,
	"source_ref" text,
	"created_by" text DEFAULT 'operator' NOT NULL,
	"primary_repo" text,
	"replay_cursor" integer DEFAULT 0 NOT NULL,
	"spec" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "workspaces" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"mission_id" uuid NOT NULL,
	"task_id" uuid NOT NULL,
	"repo" text NOT NULL,
	"root_path" text NOT NULL,
	"branch_name" text,
	"sandbox_mode" text NOT NULL,
	"lease_owner" text,
	"lease_expires_at" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "approvals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"mission_id" uuid NOT NULL,
	"task_id" uuid,
	"kind" "approval_kind" NOT NULL,
	"status" "approval_status" DEFAULT 'pending' NOT NULL,
	"requested_by" text DEFAULT 'system' NOT NULL,
	"resolved_by" text,
	"rationale" text,
	"payload" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "artifacts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"mission_id" uuid NOT NULL,
	"task_id" uuid,
	"kind" "artifact_kind" NOT NULL,
	"uri" text NOT NULL,
	"mime_type" text,
	"sha256" text,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "outbox_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"mission_id" uuid,
	"topic" text NOT NULL,
	"payload" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"status" "outbox_status" DEFAULT 'pending' NOT NULL,
	"last_error" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "replay_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"mission_id" uuid NOT NULL,
	"task_id" uuid,
	"sequence" integer NOT NULL,
	"type" "replay_event_type" NOT NULL,
	"actor" text DEFAULT 'system' NOT NULL,
	"occurred_at" text NOT NULL,
	"payload" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "twin_edges" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"from_entity_id" uuid NOT NULL,
	"to_entity_id" uuid NOT NULL,
	"relation_type" text NOT NULL,
	"source_ref" text,
	"weight" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "twin_entities" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" "twin_entity_type" NOT NULL,
	"key" text NOT NULL,
	"title" text NOT NULL,
	"repo" text,
	"freshness_status" "twin_freshness_status" DEFAULT 'unknown' NOT NULL,
	"last_observed_at" text,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "github_installations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"installation_id" text NOT NULL,
	"account_login" text NOT NULL,
	"account_type" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "repositories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"installation_ref_id" uuid,
	"full_name" text NOT NULL,
	"default_branch" text DEFAULT 'main' NOT NULL,
	"language" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "mission_inputs" ADD CONSTRAINT "mission_inputs_mission_id_missions_id_fk" FOREIGN KEY ("mission_id") REFERENCES "public"."missions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mission_tasks" ADD CONSTRAINT "mission_tasks_mission_id_missions_id_fk" FOREIGN KEY ("mission_id") REFERENCES "public"."missions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workspaces" ADD CONSTRAINT "workspaces_mission_id_missions_id_fk" FOREIGN KEY ("mission_id") REFERENCES "public"."missions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workspaces" ADD CONSTRAINT "workspaces_task_id_mission_tasks_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."mission_tasks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "approvals" ADD CONSTRAINT "approvals_mission_id_missions_id_fk" FOREIGN KEY ("mission_id") REFERENCES "public"."missions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "approvals" ADD CONSTRAINT "approvals_task_id_mission_tasks_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."mission_tasks"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "artifacts" ADD CONSTRAINT "artifacts_mission_id_missions_id_fk" FOREIGN KEY ("mission_id") REFERENCES "public"."missions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "artifacts" ADD CONSTRAINT "artifacts_task_id_mission_tasks_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."mission_tasks"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "outbox_events" ADD CONSTRAINT "outbox_events_mission_id_missions_id_fk" FOREIGN KEY ("mission_id") REFERENCES "public"."missions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "replay_events" ADD CONSTRAINT "replay_events_mission_id_missions_id_fk" FOREIGN KEY ("mission_id") REFERENCES "public"."missions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "replay_events" ADD CONSTRAINT "replay_events_task_id_mission_tasks_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."mission_tasks"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "twin_edges" ADD CONSTRAINT "twin_edges_from_entity_id_twin_entities_id_fk" FOREIGN KEY ("from_entity_id") REFERENCES "public"."twin_entities"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "twin_edges" ADD CONSTRAINT "twin_edges_to_entity_id_twin_entities_id_fk" FOREIGN KEY ("to_entity_id") REFERENCES "public"."twin_entities"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "repositories" ADD CONSTRAINT "repositories_installation_ref_id_github_installations_id_fk" FOREIGN KEY ("installation_ref_id") REFERENCES "public"."github_installations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "replay_events_mission_sequence_key" ON "replay_events" USING btree ("mission_id","sequence");