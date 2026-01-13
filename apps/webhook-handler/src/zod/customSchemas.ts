import { typeOf } from '@arthurka/ts-utils';
import { z } from 'zod/v4';
import { isNonEmptyString } from '@repo/common/src/brands';

const makeCustomErrorMessage = (name: string) => ({
  error({ input }: { input: unknown }) {
    return `${JSON.stringify(input)} of type ${typeOf(input)} is not valid ${name}`;
  },
});

export const customNonEmptyString = z.custom(isNonEmptyString, makeCustomErrorMessage('NonEmptyString'));
