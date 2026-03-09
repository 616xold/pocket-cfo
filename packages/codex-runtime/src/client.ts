import { spawn, type ChildProcessWithoutNullStreams } from "node:child_process";
import { randomUUID } from "node:crypto";
import EventEmitter from "eventemitter3";
import {
  InitializeParamsSchema,
  JsonRpcErrorSchema,
  JsonRpcNotificationSchema,
  JsonRpcSuccessSchema,
} from "./protocol";
import type { JsonRpcRequest, TurnStartParams } from "./protocol";

type PendingRequest = {
  resolve: (value: unknown) => void;
  reject: (reason: unknown) => void;
};

export type CodexRuntimeEvent =
  | { kind: "notification"; method: string; params: unknown }
  | { kind: "stderr"; line: string };

export type CodexRuntimeClientOptions = {
  command: string;
  args: string[];
  cwd?: string;
};

export class CodexAppServerClient {
  private readonly events = new EventEmitter<{
    event: [CodexRuntimeEvent];
  }>();

  private process?: ChildProcessWithoutNullStreams;
  private readonly pending = new Map<string, PendingRequest>();
  private stdoutBuffer = "";
  private stderrBuffer = "";

  constructor(private readonly options: CodexRuntimeClientOptions) {}

  onEvent(listener: (event: CodexRuntimeEvent) => void) {
    this.events.on("event", listener);
    return () => this.events.off("event", listener);
  }

  async start() {
    if (this.process) {
      return;
    }

    this.process = spawn(this.options.command, this.options.args, {
      cwd: this.options.cwd,
      stdio: "pipe",
    });

    this.process.stdout.setEncoding("utf8");
    this.process.stderr.setEncoding("utf8");
    this.process.stdout.on("data", (chunk: string) => this.handleStdout(chunk));
    this.process.stderr.on("data", (chunk: string) => this.handleStderr(chunk));
  }

  async initialize() {
    const params = InitializeParamsSchema.parse({
      clientInfo: { name: "pocket-cto", version: "0.1.0" },
      capabilities: { experimentalApi: false },
    });

    await this.request("initialize", params);
    await this.notify("initialized", {});
  }

  async startThread(params: {
    cwd?: string;
    model?: string;
    approvalPolicy?: string;
    sandbox?: string;
    serviceName?: string;
  }) {
    return this.request("thread/start", params);
  }

  async startTurn(params: TurnStartParams) {
    return this.request("turn/start", params);
  }

  async interruptTurn(params: { threadId: string; turnId: string }) {
    return this.request("turn/interrupt", params);
  }

  async stop() {
    if (!this.process) {
      return;
    }

    this.process.kill("SIGTERM");
    this.process = undefined;
  }

  private async request(method: string, params: unknown) {
    const id = randomUUID();
    const payload: JsonRpcRequest = {
      jsonrpc: "2.0",
      id,
      method,
      params,
    };

    const promise = new Promise<unknown>((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
    });

    this.write(payload);
    return promise;
  }

  private async notify(method: string, params: unknown) {
    this.write({
      jsonrpc: "2.0",
      method,
      params,
    });
  }

  private write(payload: Record<string, unknown>) {
    if (!this.process) {
      throw new Error("Codex app server is not started");
    }

    this.process.stdin.write(`${JSON.stringify(payload)}\n`);
  }

  private handleStdout(chunk: string) {
    this.stdoutBuffer += chunk;

    while (true) {
      const newlineIndex = this.stdoutBuffer.indexOf("\n");
      if (newlineIndex === -1) {
        break;
      }

      const line = this.stdoutBuffer.slice(0, newlineIndex).trim();
      this.stdoutBuffer = this.stdoutBuffer.slice(newlineIndex + 1);

      if (!line) {
        continue;
      }

      this.handleStdoutLine(line);
    }
  }

  private handleStderr(chunk: string) {
    this.stderrBuffer += chunk;

    while (true) {
      const newlineIndex = this.stderrBuffer.indexOf("\n");
      if (newlineIndex === -1) {
        break;
      }

      const line = this.stderrBuffer.slice(0, newlineIndex).trim();
      this.stderrBuffer = this.stderrBuffer.slice(newlineIndex + 1);

      if (!line) {
        continue;
      }

      this.events.emit("event", { kind: "stderr", line });
    }
  }

  private handleStdoutLine(line: string) {
    const parsed = JSON.parse(line);

    const success = JsonRpcSuccessSchema.safeParse(parsed);
    if (success.success) {
      const key = String(success.data.id);
      const pending = this.pending.get(key);

      if (pending) {
        this.pending.delete(key);
        pending.resolve(success.data.result);
      }

      return;
    }

    const error = JsonRpcErrorSchema.safeParse(parsed);
    if (error.success) {
      const key = String(error.data.id);
      const pending = this.pending.get(key);

      if (pending) {
        this.pending.delete(key);
        pending.reject(error.data.error);
      }

      return;
    }

    const notification = JsonRpcNotificationSchema.safeParse(parsed);
    if (notification.success) {
      this.events.emit("event", {
        kind: "notification",
        method: notification.data.method,
        params: notification.data.params,
      });
      return;
    }

    throw new Error(`Unrecognized Codex App Server message: ${line}`);
  }
}
