# F6Y Board/Lender Document Source-Pack Fixture

This fixture is the single F6Y board/lender document source-pack family.

It contains two immutable raw document sources for one deterministic company key:

- `sources/board-material.md`
- `sources/lender-document.txt`

Both sources use source kind `document` and only the supported fixture media types `text/markdown` and `text/plain`.
The document roles are exactly `board_material` and `lender_document`.
The expected posture file normalizes away generated identifiers, timestamps, source identifiers, source-file identifiers, source snapshot identifiers, compile run identifiers, storage references, and object-store references.

The proof command is direct:

```bash
pnpm exec tsx tools/board-lender-document-source-pack-proof.mjs
```

The fixture does not add routes, schema, migrations, package scripts, smoke aliases, eval datasets, UI, runtime-Codex behavior, delivery, provider behavior, reports, board packets, lender updates, approvals, certification, finance writes, generated prose, or autonomous action.
