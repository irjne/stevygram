import { User } from '../lib/users';
import { NextFunction } from 'express-serve-static-core';
declare const router: import("express-serve-static-core").Router;
export declare let userOnSession: User;
export declare const authorization: (req: any, res: any, next: NextFunction) => Promise<any>;
export default router;
//# sourceMappingURL=users.d.ts.map