import { z, ZodType } from 'zod/v4';

export const noTrailingSlashUrl = z.url().refine(e => !e.endsWith('/'), {
  message: 'Should not end with trailing slash',
});

export const makeRouteResponse = <U1, V1, U2, V2>(error: ZodType<U1, V1>, data: ZodType<U2, V2>) => (
  z.union([
    z.object({
      success: z.literal(false),
      data: z.undefined().optional(),
      error,
    }),
    z.object({
      success: z.literal(true),
      error: z.undefined().optional(),
      data,
    }),
  ])
);
