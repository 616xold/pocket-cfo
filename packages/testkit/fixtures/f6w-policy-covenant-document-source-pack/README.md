# F6W Policy/Covenant Document Source-Pack Fixture

This fixture is the single F6W policy/covenant document source-pack family.

It contains two immutable raw document sources for one deterministic company key:

- `sources/policy-covenant-threshold.md`
- `sources/policy-covenant-control.txt`

Both sources use source kind `document`, document role `policy_document`, and only the supported fixture media types `text/markdown` and `text/plain`.
The expected posture file normalizes away generated identifiers, timestamps, storage references, and object-store references.

The proof command is direct:

```bash
pnpm exec tsx tools/policy-covenant-document-source-pack-proof.mjs
```

The fixture does not add routes, schema, migrations, package scripts, smoke aliases, eval datasets, UI, runtime-Codex behavior, delivery, provider behavior, reports, approvals, certification, finance writes, generated prose, or autonomous action.
