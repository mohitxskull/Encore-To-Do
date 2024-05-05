import { Encryption } from '@adonisjs/encryption';
import { secret } from 'encore.dev/config';

const SECRET = secret('SECRET');

export const encryption = new Encryption({
  secret: SECRET(),
  algorithm: 'aes-256-cbc',
});
