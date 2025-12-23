import { Brand, WITNESS } from '@arthurka/ts-utils';
import { validate } from 'uuid';
import { initializeByTypeGuard } from '../utils';
import { isNonEmptyString, NonEmptyString } from './common';

export type UUID = Brand<NonEmptyString, 'UUID'>;
export const isUUID = (e: unknown): e is UUID => (
  true
    && isNonEmptyString(e)
    && validate(e)
);
export const UUID = (e: UUID[WITNESS]): UUID => (
  initializeByTypeGuard(e, isUUID, 'UUID')
);
