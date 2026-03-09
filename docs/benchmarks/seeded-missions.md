# Seeded benchmark missions

Pocket CTO should have a small benchmark suite from the beginning.

## Why

Without seeded missions, it is too easy to confuse a flashy demo with a reliable system.

## v1 seeded missions

1. **Build task**
   Implement a small feature from a short prompt and produce a PR plus proof bundle.

2. **Bug fix**
   Reproduce a failing test, patch it, and attach verification.

3. **Discovery task**
   Answer a blast-radius question using the twin and cite the entities used.

4. **Review task**
   Run a reviewer thread against a proposed diff and produce a revision note.

## Metrics

Track at least:

- acceptance rate
- time to first useful evidence
- proof bundle completeness
- operator touch time
- replay fidelity
- cost per successful mission

## Repository implementation map

- fixtures: `packages/testkit/src/fixtures.ts`
- docs: this file
- later eval runners: `apps/control-plane/src/modules/evals/`
