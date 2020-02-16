import mongoose from 'mongoose';
export interface User extends mongoose.Document {
    name: string;
    surname: string;
    nickname: string;
    phone: string;
    password: string;
    phonebook: string[];
}
//# sourceMappingURL=users.d.ts.map