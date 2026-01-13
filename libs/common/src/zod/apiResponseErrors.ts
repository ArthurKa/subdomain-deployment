import { z } from 'zod/v4';

export const UnexpectedServerError = z.object({
  type: z.literal('UnexpectedServerError'),
});
export type UnexpectedServerError = z.infer<typeof UnexpectedServerError>;

export const Unauthorized = z.object({
  type: z.literal('Unauthorized'),
});
export type Unauthorized = z.infer<typeof Unauthorized>;

export const WrongBodyParams = z.object({
  type: z.literal('WrongBodyParams'),
  __WARNING_DO_NOT_USE__zodIssues: z.custom((e): e is z.core.$ZodIssue[] => true),
});
