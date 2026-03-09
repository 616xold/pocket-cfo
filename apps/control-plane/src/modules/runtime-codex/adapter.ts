import type { CodexAppServerClient } from "@pocket-cto/codex-runtime";

export class RuntimeCodexAdapter {
  constructor(private readonly client: CodexAppServerClient) {}

  getClient() {
    return this.client;
  }
}
