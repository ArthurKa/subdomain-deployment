import { Brand, WITNESS } from '@arthurka/ts-utils';
import { initializeByTypeGuard } from '../utils';

export type NonEmptyString = Brand<string, 'NonEmptyString'>;
export const isNonEmptyString = (e: unknown): e is NonEmptyString => (
  true
    && typeof e === 'string'
    && e !== ''
);
export const NonEmptyString = (e: NonEmptyString[WITNESS]): NonEmptyString => (
  initializeByTypeGuard(e, isNonEmptyString, 'NonEmptyString')
);
