import { Header, Gateway, APIError } from 'encore.dev/api';
import { authHandler } from 'encore.dev/auth';
import { encryption } from './lib/encryption';
import { messageBuilder } from '../lib/message-builder';
import { db } from './lib/db';
import { AuthRes } from '../lib/types';
import logger from 'encore.dev/log';

interface AuthReq {
  authorization: Header<'Authorization'>;
}

export const auth = authHandler<AuthReq, AuthRes>(async (params) => {
  try {
    const encryptedToken = params.authorization.split(' ')[1];

    const decryptedToken = encryption.decrypt<string>(encryptedToken);

    logger.debug('Decrypted token', { decryptedToken });

    if (!decryptedToken) {
      throw APIError.unauthenticated('Not authenticated');
    }

    const token = messageBuilder.verify<{ id: string }>(
      decryptedToken,
      'session'
    );

    logger.debug('Token', { token });

    if (!token) {
      throw APIError.unauthenticated('Not authenticated');
    }

    const userExist = await db.query.UserSchema.findFirst({
      where: (user, { eq }) => {
        return eq(user.ID, token.id);
      },

      columns: {
        ID: true,
        Email: true,
        EmailVerified: true,
        Name: true,
        CreatedAt: true,
        UpdatedAt: true,
      },
    });

    logger.debug('User', { userExist });

    if (!userExist) {
      throw APIError.unauthenticated('Not authenticated');
    }

    return {
      userID: userExist.ID,
      Name: userExist.Name,
      Email: userExist.Email,
      CreatedAt: userExist.CreatedAt.getTime(),
      UpdatedAt: userExist.UpdatedAt
        ? userExist.UpdatedAt.getTime()
        : undefined,
      EmailVerified: userExist.EmailVerified
        ? userExist.EmailVerified.getTime()
        : undefined,
    };
  } catch (error) {
    throw APIError.internal('Internal server error', error as Error);
  }
});

export const gateway = new Gateway({
  authHandler: auth,
});
