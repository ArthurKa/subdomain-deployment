import assert from 'assert';
import { z, ZodError } from 'zod/v4';

const Envs = z.object({
  AUTH_SECRET_TOKEN: z.string(),
  GITLAB_PROJECT_CI_CD_API_TOKEN: z.string(),
  REDIS_PASS: z.string(),
  REDIS_CONNECTION_URL: z.url(),
});
type Envs = z.infer<typeof Envs>;

let envs: Envs;

try {
  // eslint-disable-next-line no-process-env
  envs = Envs.parse(process.env);
} catch(e) {
  assert(e instanceof ZodError, 'This should never happen. |81x6rn|');

  console.error('.env Zod issues:', e.issues);
  throw e;
}

export const AUTH_SECRET_TOKEN = envs.AUTH_SECRET_TOKEN;
export const GITLAB_PROJECT_CI_CD_API_TOKEN = envs.GITLAB_PROJECT_CI_CD_API_TOKEN;
export const REDIS_PASS = envs.REDIS_PASS;
export const REDIS_CONNECTION_URL = envs.REDIS_CONNECTION_URL;
