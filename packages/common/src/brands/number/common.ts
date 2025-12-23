import { Brand, WITNESS } from '@arthurka/ts-utils';
import { initializeByTypeGuard } from '../utils';

/**
  Non-negative number.

  @example
  0, 1.2345, 100500.
*/
export type NonNegative = Brand<number, '>= 0'>;
export const isNonNegative = (e: unknown): e is NonNegative => (
  true
    && typeof e === 'number'
    && e >= 0
);
export const NonNegative = (e: NonNegative[WITNESS]): NonNegative => (
  initializeByTypeGuard(e, isNonNegative, 'NonNegative')
);

/**
  Positive number.

  @example
  1, 1.2345, 100500.
*/
export type Positive = Brand<NonNegative, '> 0'>;
export const isPositive = (e: unknown): e is Positive => (
  true
    && isNonNegative(e)
    && e > 0
);
export const Positive = (e: Positive[WITNESS]): Positive => (
  initializeByTypeGuard(e, isPositive, 'Positive')
);

/**
  Integer number.

  @example
  -5, 0, 1, -100500.
*/
export type Integer = Brand<number, 'Integer'>;
export const isInteger = (e: unknown): e is Integer => Number.isInteger(e);
export const Integer = (e: Integer[WITNESS]): Integer => (
  initializeByTypeGuard(e, isInteger, 'Integer')
);

/**
  Positive integer number.

  @example
  5, 10, 1, 100500.
*/
export type PositiveInteger = Brand<Positive, Integer>;
export const isPositiveInteger = (e: unknown): e is PositiveInteger => isPositive(e) && isInteger(e);
export const PositiveInteger = (e: PositiveInteger[WITNESS]): PositiveInteger => (
  initializeByTypeGuard(e, isPositiveInteger, 'PositiveInteger')
);

/**
  Non-negative integer number.

  @example
  0, 1, 48, 132, 100500.
*/
export type NonNegativeInteger = Brand<NonNegative, Integer>;
export const isNonNegativeInteger = (e: unknown): e is NonNegativeInteger => isNonNegative(e) && isInteger(e);
export const NonNegativeInteger = (e: NonNegativeInteger[WITNESS]): NonNegativeInteger => (
  initializeByTypeGuard(e, isNonNegativeInteger, 'NonNegativeInteger')
);
