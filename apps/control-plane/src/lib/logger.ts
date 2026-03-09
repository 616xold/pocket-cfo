import pino from "pino";

export function createLogger() {
  return {
    name: "pocket-cto-control-plane",
    level: process.env.NODE_ENV === "development" ? "debug" : "info",
  } as const;
}

export function createProcessLogger() {
  return pino(createLogger());
}
