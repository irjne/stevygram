import { NextFunction } from 'express-serve-static-core';
import { User } from '../lib/users';
declare const router: import("express-serve-static-core").Router;
export declare let userOnSession: User;
export declare const authorization: (req: any, res: any, next: NextFunction) => Promise<any>;
export declare const usersMongoDBConnection: () => Promise<void>;
export default router;
//# sourceMappingURL=mongooseUsers.d.ts.map