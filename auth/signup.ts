import { api, APIError } from 'encore.dev/api';
import { UserSchema } from '../database/schema';
import { hash } from '../lib/hash';
import * as z from 'zod';
import { ZodCheck } from '../lib/zod-check';
import { db } from './lib/db';

const RouteReqZod = z.object({
  name: z.string().min(3).max(50, 'Name must be between 3 and 50 characters'),
  email: z.string().email().max(255, 'Email must be less than 255 characters'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(50, 'Password must be less than 50 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'
    ),
});

interface RouteReq {
  name: string;
  email: string;
  password: string;
}

interface RouteRes {
  code: string;
  message: string;
  error?: any;
}

// Sign up route.
export const signup = api(
  { expose: true, method: 'POST', path: '/auth/signup' },
  async (params: RouteReq): Promise<RouteRes> => {
    try {
      const paramsCheck = await ZodCheck(RouteReqZod, params);

      if (paramsCheck) {
        return paramsCheck;
      }

      const emailExist = await db.query.UserSchema.findFirst({
        where: (user, { eq }) => {
          return eq(user.Email, params.email);
        },
        columns: {
          ID: true,
        },
      });

      if (emailExist) {
        throw APIError.alreadyExists('Email already exists');
      }

      const hashedPassword = await hash.make(params.password);

      await db.insert(UserSchema).values({
        Name: params.name,
        Email: params.email,
        Password: hashedPassword,
      });

      return {
        code: 'success',
        message: 'User created successfully',
      };
    } catch (error) {
      throw APIError.internal('Internal server error', error as Error);
    }
  }
);
