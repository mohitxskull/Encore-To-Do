import { APIError, api } from 'encore.dev/api';
import { getAuthData } from '~encore/auth';
import { AuthRes } from '../lib/types';

interface RouteRes {
  code: string;
  message: string;
  error?: any;
  data?: AuthRes;
}

// Sign in route
export const user = api(
  { expose: true, method: 'GET', path: '/auth/user', auth: true },
  async (): Promise<RouteRes> => {
    try {
      const authData = getAuthData()!;

      return {
        code: 'success',
        message: 'User found',
        data: authData,
      };
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }

      throw APIError.internal('Internal server error', error as Error);
    }
  }
);
