import { Express } from 'express';
import { commonUrls } from '@repo/common/src/commonUrls';
import { routes } from '@repo/common/src/zod';
import { AUTH_SECRET_TOKEN, GITLAB_PROJECT_CI_CD_API_TOKEN } from '@repo/common/src/envVariables/private';
import { DOMAIN, TARGET_MR_LABEL } from '@repo/common/src/envVariables/public';
import { isNull } from '@arthurka/ts-utils';
import { redisService } from '../services/redisService';

export const mountWebhookHandler = (app: Express) => {
  app.post<unknown, routes._.RouteResponse>(commonUrls._, async (req, res) => {
    {
      const { success, data } = routes._.ReqHeaders.safeParse(req.headers);
      if(success === false || data.authToken !== AUTH_SECRET_TOKEN) {
        res.status(401).json({
          success: false,
          error: {
            type: 'Unauthorized',
          },
        });
        return;
      }
    }

    const { success, data, error } = routes._.ReqBody.safeParse(req.body);
    if(success === false) {
      res.status(400).json({
        success: false,
        error: {
          type: 'WrongBodyParams',
          __WARNING_DO_NOT_USE__zodIssues: error.issues,
        },
      });
      return;
    }

    res.json({
      success: true,
      data: true,
    });

    const alreadyDeployedLastCommitHash = await redisService.subdomainLatestCommitHash.get(data.iid);
    const subdomain = `mr-${data.iid}.${DOMAIN}`;
    const formData = new FormData();

    formData.append('token', GITLAB_PROJECT_CI_CD_API_TOKEN);
    formData.append('variables[IID]', data.iid);

    switch(true) {
      // eslint-disable-next-line max-len
      case data.labels.includes(TARGET_MR_LABEL) && (isNull(alreadyDeployedLastCommitHash) || alreadyDeployedLastCommitHash !== data.latestCommitHash):
        await redisService.subdomainLatestCommitHash.set(data.iid, data.latestCommitHash);

        formData.append('variables[TRIGGER_CUSTOM_TYPE]', 'subdomain-deploy-add');
        formData.append('variables[CI_COMMIT_MESSAGE]', `Deploy [${data.latestCommitHash.slice(0, 7)}] to ${subdomain}`);
        formData.append('variables[LATEST_COMMIT_HASH]', data.latestCommitHash);
        break;
      case !data.labels.includes(TARGET_MR_LABEL) && !isNull(alreadyDeployedLastCommitHash):
        await redisService.subdomainLatestCommitHash.delete(data.iid);

        formData.append('variables[TRIGGER_CUSTOM_TYPE]', 'subdomain-deploy-remove');
        formData.append('variables[CI_COMMIT_MESSAGE]', `Remove ${subdomain}`);
        break;
      default:
        return;
    }

    const resp = await fetch(`https://gitlab.com/api/v4/projects/${data.projectId}/ref/master/trigger/pipeline`, {
      method: 'POST',
      body: formData,
    }).then(e => e.json());
    if(typeof resp === 'object' && !isNull(resp) && 'message' in resp) {
      console.error(resp);
    }
  });
};
