// src/types/express.d.ts
// Extends Express Request to carry authenticated user context.

import { User } from '@prisma/client';

declare global {
    namespace Express {
        interface Request {
            user?: Pick<User, 'id' | 'email' | 'name'>;
        }
    }
}

export { };
