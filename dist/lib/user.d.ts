export interface User {
    name: string;
    surname: string;
    nickname: string;
    phone: string;
}
export declare const directory: string;
export declare const addUser: (nickname: string, name: string, surname: string, phone: string) => Promise<any>;
export declare const getAllUsers: (findByName?: string | undefined) => Promise<any>;
export declare const changeUserByPhone: (phone: string, nickname?: string | undefined, name?: string | undefined, surname?: string | undefined) => Promise<any>;
export declare const removeUserByPhone: (phone: string) => Promise<any>;
export declare const findUserByPhone: (phone: string) => Promise<User>;
//# sourceMappingURL=user.d.ts.map