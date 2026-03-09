# Engineering twin

The engineering twin is a freshness-aware model of the codebase and runtime environment.

It is not a vague memory blob.
It is a queryable set of typed entities, edges, and source references.

## v1 twin scope

Start with a useful, small twin:

- repositories and packages
- CODEOWNERS and ownership metadata
- CI workflows and jobs
- test suites
- docs and runbooks
- deployment descriptors
- dashboards and alerts
- flags and rollback levers

## v1 non-goals

Do not start with a giant graph database or universal AST platform.

The first twin should be:

- queryable
- freshness-aware
- explicit about missing data
- useful for blast-radius questions

## Entity examples

- `repository`
- `service`
- `testSuite`
- `ciJob`
- `runbook`
- `dashboard`
- `flag`
- `owner`

## Freshness fields

Every twin entity should track:

- `lastObservedAt`
- `freshnessStatus`
- `sourceType`
- `sourceRef`

Suggested freshness states:

- `fresh`
- `stale`
- `unknown`

## First killer query

A good v1 query is:

> if auth changes, which repos, test suites, owners, dashboards, and rollback levers matter?

## Repository implementation map

- Domain types: `packages/domain/src/twin.ts`
- DB schema: `packages/db/src/schema/twin.ts`
- Extraction services: `apps/control-plane/src/modules/twin/`
- Stack-pack hooks: `packages/stack-packs/src/stack-pack.ts`
