import { User } from './users';
export interface Message {
    sender: string | User;
    body: string;
    date: Date;
}
export interface Chat {
    id: number;
    name: string;
    description: string;
    users: string[];
    messages: Message[];
    lastMessage: Message;
}
export declare const directory: string;
export declare const addChat: (id: number, name: string, description: string, users: string[]) => Promise<any>;
export declare const getAllChats: (user?: User | undefined) => Promise<Chat[]>;
export declare const getUsersByChatId: (id: number) => Promise<any>;
export declare const getInfoByChatId: (id: number, user?: User | undefined) => Promise<any>;
export declare const getMessagesByChatId: (id: number) => Promise<any>;
export declare const changeInfoByChatId: (id: number, name?: string | undefined, description?: string | undefined) => Promise<any>;
export declare const searchByChatId: (id: number, sender?: string | undefined, word?: string | undefined) => Promise<any>;
export declare const removeChatById: (id: number) => Promise<any>;
//# sourceMappingURL=chats.d.ts.map