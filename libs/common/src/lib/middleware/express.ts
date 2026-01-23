import type { User } from '@e-shop/database';

declare module 'express-serve-static-core' {
  interface Request {
    user?: User | null;
  }
}

export {};
