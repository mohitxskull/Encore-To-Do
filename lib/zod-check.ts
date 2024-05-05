import { ZodObject } from 'zod';

/**
 * ZodCheck
 *
 * will be used in routes to check the request body against a Zod schema
 */
export const ZodCheck = async (schema: ZodObject<any, any>, body: any) => {
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    const errObj = parsed.error.errors.reduce((acc, error) => {
      acc[error.path.join('.')] = error.message;
      return acc;
    }, {} as Record<string, string>);

    return {
      code: 'invalid_argument',
      message: 'Invalid request body, see error for details',
      error: errObj,
    };
  }

  return null;
};
