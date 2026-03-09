import type { FastifyInstance } from "fastify";
import { ZodError } from "zod";

export type ApiErrorCode =
  | "invalid_request"
  | "mission_not_found"
  | "internal_error";

export type ApiErrorDetail = {
  path: string;
  message: string;
};

export type ApiErrorResponse = {
  error: {
    code: ApiErrorCode;
    message: string;
    details?: ApiErrorDetail[];
  };
};

type ErrorMapping = {
  statusCode: number;
  body: ApiErrorResponse;
};

export class AppHttpError extends Error {
  readonly statusCode: number;
  readonly body: ApiErrorResponse;

  constructor(
    statusCode: number,
    body: ApiErrorResponse,
  ) {
    super(body.error.message);
    this.name = "AppHttpError";
    this.statusCode = statusCode;
    this.body = body;
  }
}

export class MissionNotFoundError extends AppHttpError {
  readonly missionId: string;

  constructor(missionId: string) {
    super(404, {
      error: {
        code: "mission_not_found",
        message: "Mission not found",
      },
    });
    this.name = "MissionNotFoundError";
    this.missionId = missionId;
  }
}

export function registerHttpErrorHandler(app: FastifyInstance) {
  app.setErrorHandler((error, request, reply) => {
    const mapped = mapHttpError(error);

    if (mapped.statusCode >= 500) {
      request.log.error({ err: error }, "Request failed");
    } else {
      request.log.warn(
        {
          err: error,
          statusCode: mapped.statusCode,
          errorCode: mapped.body.error.code,
        },
        mapped.body.error.message,
      );
    }

    void reply.code(mapped.statusCode).send(mapped.body);
  });
}

function mapHttpError(error: unknown): ErrorMapping {
  if (error instanceof AppHttpError) {
    return {
      statusCode: error.statusCode,
      body: error.body,
    };
  }

  if (error instanceof ZodError) {
    return {
      statusCode: 400,
      body: {
        error: {
          code: "invalid_request",
          message: "Invalid request",
          details: error.issues.map((issue) => ({
            path: formatIssuePath(issue.path),
            message: issue.message,
          })),
        },
      },
    };
  }

  if (hasStatusCode(error) && error.statusCode === 400) {
    return {
      statusCode: 400,
      body: {
        error: {
          code: "invalid_request",
          message: "Invalid request",
          details: [
            {
              path: "request",
              message: error.message,
            },
          ],
        },
      },
    };
  }

  return {
    statusCode: 500,
    body: {
      error: {
        code: "internal_error",
        message: "Internal server error",
      },
    },
  };
}

function formatIssuePath(path: Array<string | number>) {
  if (path.length === 0) {
    return "request";
  }

  return path.map(String).join(".");
}

function hasStatusCode(
  error: unknown,
): error is { statusCode: number; message: string } {
  return (
    typeof error === "object" &&
    error !== null &&
    "statusCode" in error &&
    typeof error.statusCode === "number" &&
    "message" in error &&
    typeof error.message === "string"
  );
}
