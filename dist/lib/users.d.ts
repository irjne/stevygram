export interface User {
    name: string;
    surname: string;
    nickname: string;
    phone: string;
    password: string;
    phonebook: string[];
}
export declare const directory: string;
export declare const addUser: (nickname: string, name: string, surname: string, phone: string, password: string) => Promise<any>;
export declare const addInPhonebookByPhone: (findByPhone: string, usersToAdd: string[]) => Promise<any>;
export declare const getAllUsers: (findByName?: string | undefined) => Promise<any>;
export declare const getPhonebookInfoByPhone: (phone: string) => Promise<any>;
export declare const changeUserByPhone: (phone: string, nickname?: string | undefined, name?: string | undefined, surname?: string | undefined) => Promise<any>;
export declare const removeUserByPhone: (phone: string) => Promise<any>;
export declare const findUserByPhone: (phone: string) => Promise<User>;
//# sourceMappingURL=users.d.ts.map