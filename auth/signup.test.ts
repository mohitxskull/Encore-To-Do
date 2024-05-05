import { describe, expect, test } from 'vitest';
import { db } from './lib/db';
import { UserSchema } from '../database/schema';
import { eq } from 'drizzle-orm';
import { signup } from './signup';

describe('auth/signup', () => {
  test('sucess', async () => {
    const result = await signup({
      name: 'Greatest Of All Time',
      email: 'goat@earth.milkyway',
      password: '1234Abcd$',
    });

    expect(result).toEqual({
      code: 'success',
      message: 'User created successfully',
    });

    await db
      .delete(UserSchema)
      .where(eq(UserSchema.Email, 'goat@earth.milkyway'));
  });
});
