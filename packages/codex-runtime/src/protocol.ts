import { z } from "zod";

export const JsonRpcIdSchema = z.union([z.string(), z.number(), z.null()]);

export const InitializeParamsSchema = z.object({
  clientInfo: z.object({
    name: z.string(),
    version: z.string(),
  }),
  capabilities: z
    .object({
      experimentalApi: z.boolean().optional(),
    })
    .default({}),
});

export const ThreadSchema = z.object({
  id: z.string(),
  title: z.string().optional(),
  ephemeral: z.boolean().optional(),
  path: z.string().nullable().optional(),
});

export const TurnSchema = z.object({
  id: z.string(),
  threadId: z.string(),
  status: z.string(),
});

export const InputTextItemSchema = z.object({
  type: z.literal("text"),
  text: z.string(),
});

export const SkillItemSchema = z.object({
  type: z.literal("skill"),
  name: z.string(),
  path: z.string(),
});

export const TurnStartParamsSchema = z.object({
  threadId: z.string(),
  input: z.array(z.union([InputTextItemSchema, SkillItemSchema])),
  cwd: z.string().optional(),
  model: z.string().optional(),
  approvalPolicy: z.string().optional(),
  sandboxPolicy: z
    .object({
      type: z.string(),
      writableRoots: z.array(z.string()).optional(),
      networkAccess: z.union([z.boolean(), z.string()]).optional(),
    })
    .optional(),
  effort: z.string().optional(),
});

export const JsonRpcRequestSchema = z.object({
  jsonrpc: z.literal("2.0"),
  id: JsonRpcIdSchema,
  method: z.string(),
  params: z.unknown().optional(),
});

export const JsonRpcSuccessSchema = z.object({
  jsonrpc: z.literal("2.0"),
  id: JsonRpcIdSchema,
  result: z.unknown(),
});

export const JsonRpcErrorSchema = z.object({
  jsonrpc: z.literal("2.0"),
  id: JsonRpcIdSchema.optional(),
  error: z.object({
    code: z.number(),
    message: z.string(),
    data: z.unknown().optional(),
  }),
});

export const JsonRpcNotificationSchema = z.object({
  jsonrpc: z.literal("2.0"),
  method: z.string(),
  params: z.unknown().optional(),
});

export type Thread = z.infer<typeof ThreadSchema>;
export type Turn = z.infer<typeof TurnSchema>;
export type TurnStartParams = z.infer<typeof TurnStartParamsSchema>;
export type JsonRpcRequest = z.infer<typeof JsonRpcRequestSchema>;
export type JsonRpcSuccess = z.infer<typeof JsonRpcSuccessSchema>;
export type JsonRpcError = z.infer<typeof JsonRpcErrorSchema>;
export type JsonRpcNotification = z.infer<typeof JsonRpcNotificationSchema>;
