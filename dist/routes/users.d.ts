import mongoose from 'mongoose';
import { User } from '../lib/users';
export declare const usersSchema: mongoose.Schema<any>;
export declare const usersModel: mongoose.Model<User, {}>;
declare const router: import("express-serve-static-core").Router;
export declare const authorization: (req: any, res: any, next: any) => Promise<any>;
export declare const mongoDBConnection: () => Promise<void>;
export default router;
//# sourceMappingURL=users.d.ts.map