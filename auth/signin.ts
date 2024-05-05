import { api, APIError } from 'encore.dev/api';
import { getAuthData } from '~encore/auth';
import { db } from './lib/db';
import { hash } from '../lib/hash';
import { messageBuilder } from '../lib/message-builder';
import { encryption } from './lib/encryption';

interface RouteRes {
  code: string;
  message: string;
  error?: any;
  data?: {
    token: string;
  };
}

interface RouteReq {
  email: string;
  password: string;
}

// Sign in route wich returns an opaque token
export const signin = api(
  { expose: true, method: 'POST', path: '/auth/signin' },
  async (params: RouteReq): Promise<RouteRes> => {
    try {
      const authData = getAuthData();

      if (authData) {
        throw APIError.permissionDenied('Already signed in');
      }

      const emailExist = await db.query.UserSchema.findFirst({
        where: (user, { eq }) => {
          return eq(user.Email, params.email);
        },
        columns: {
          ID: true,
          Password: true,
        },
      });

      if (!emailExist) {
        throw APIError.invalidArgument('Email or password is incorrect');
      }

      const passwordMatch = await hash.verify(
        emailExist.Password,
        params.password
      );

      if (!passwordMatch) {
        throw APIError.invalidArgument('Email or password is incorrect');
      }

      const token = messageBuilder.build(
        {
          id: emailExist.ID,
        },
        '1 hour',
        'session'
      );

      const encToken = encryption.encrypt(token);

      return {
        code: 'success',
        message: 'User signed in successfully',
        data: {
          token: encToken,
        },
      };
    } catch (error) {
      throw APIError.internal('Internal server error', error as Error);
    }
  }
);
