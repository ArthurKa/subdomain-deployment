import { z } from 'zod/v4';
import { makeRouteResponse } from '../common';
import { UnexpectedServerError } from '../apiResponseErrors';

export const RouteResponse = makeRouteResponse(
  UnexpectedServerError,
  z.literal(true),
);
export type RouteResponse = z.infer<typeof RouteResponse>;
