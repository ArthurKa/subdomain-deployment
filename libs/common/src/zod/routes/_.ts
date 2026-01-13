import { z } from 'zod/v4';
import { makeRouteResponse } from '../common';
import { Unauthorized, UnexpectedServerError, WrongBodyParams } from '../apiResponseErrors';

export const ReqHeaders = (
  z
    .object({
      'x-gitlab-token': z.string(),
    })
    .transform(e => ({
      authToken: e['x-gitlab-token'],
    }))
);
export type ReqHeaders = z.infer<typeof ReqHeaders>;

export const ReqBody = (
  z
    .object({
      object_attributes: z.object({
        iid: z.number(),
        last_commit: z.object({
          id: z.string(),
        }),
      }),
      project: z.object({
        id: z.number(),
      }),
      labels: z.array(
        z.object({
          title: z.string(),
        }),
      ),
    })
    .transform(e => ({
      iid: e.object_attributes.iid,
      latestCommitHash: e.object_attributes.last_commit.id,
      projectId: e.project.id,
      labels: e.labels.map(e => e.title),
    }))
);
export type ReqBody = z.infer<typeof ReqBody>;

export const RouteResponse = makeRouteResponse(
  z.union([UnexpectedServerError, Unauthorized, WrongBodyParams]),
  z.literal(true),
);
export type RouteResponse = z.infer<typeof RouteResponse>;
