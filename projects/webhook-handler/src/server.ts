import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import cookieParser from 'cookie-parser';
import { UnexpectedServerError } from '@repo/common/src/zod/apiResponseErrors';
import { name } from '../package.json';
import { mountRouter } from './router';

export const initServer = () => {
  const app = express();
  const server = createServer(app);

  app.use(cors({
    origin: true,
    credentials: true,
  }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  mountRouter(app);

  // Warn: do not touch this, for some weird reason it correctly works as unhandled errors handler
  // @ts-expect-error
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.use((err, req, res, next) => {
    console.error('Something went wrong. |g7uw54|', err);
    res.status(500).json({
      success: false,
      error: {
        type: 'UnexpectedServerError',
      } satisfies UnexpectedServerError,
    });
  });
  process.on('unhandledRejection', (reason, promise) => {
    console.error('Something went wrong. |i62270|', promise, JSON.stringify(reason, null, 2));
  });
  process.on('uncaughtException', (err, errOrigin) => {
    console.error('Something went wrong. |03mi29|', err, errOrigin);
  });

  const port = 3000;
  server.listen(port, () => {
    console.info(`${name} is listening on localhost:${port}`);
  });
};
