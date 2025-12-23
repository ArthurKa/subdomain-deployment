import { Express } from 'express';
import { commonUrls } from '@repo/common/src/commonUrls';
import { routes } from '@repo/common/src/zod';
import { mountWebhookHandler } from './webhookHandler';

export const mountRouter = (app: Express) => {
  mountWebhookHandler(app);

  app.get<unknown, routes.health.RouteResponse>(commonUrls.health, (req, res) => {
    res.json({
      success: true,
      data: true,
    });
  });
};
