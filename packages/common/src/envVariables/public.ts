import assert from 'assert';
import { z, ZodError } from 'zod/v4';

const Envs = z.object({
  NODE_ENV: z.enum(['production', 'development']),
  DOMAIN: z.string(),
  TARGET_MR_LABEL: z.string(),
});
type Envs = z.infer<typeof Envs>;

let envs: Envs;

try {
  // eslint-disable-next-line no-process-env
  envs = Envs.parse(process.env);
} catch(e) {
  assert(e instanceof ZodError, 'This should never happen. |01rtz9|');

  console.error('.env Zod issues:', e.issues);
  throw e;
}

export const publicEnvs = envs;

export const NODE_ENV = envs.NODE_ENV;
export const DOMAIN = envs.DOMAIN;
export const TARGET_MR_LABEL = envs.TARGET_MR_LABEL;
