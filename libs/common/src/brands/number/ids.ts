import { Brand, WITNESS } from '@arthurka/ts-utils';
import { initializeByTypeGuard } from '../utils';
import { isPositiveInteger, PositiveInteger } from './common';

export type TelegramUserId = Brand<PositiveInteger, 'TelegramUserId'>;
export const isTelegramUserId = (e: unknown): e is TelegramUserId => isPositiveInteger(e);
export const TelegramUserId = (e: TelegramUserId[WITNESS]): TelegramUserId => (
  initializeByTypeGuard(e, isTelegramUserId, 'TelegramUserId')
);
