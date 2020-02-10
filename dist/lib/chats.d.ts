import mongoose from 'mongoose';
export interface Message extends mongoose.Document {
    sender: string;
    body: string;
    date: Date;
}
export interface Chat extends mongoose.Document {
    id: number;
    name: string;
    description: string;
    admin: string[];
    users: string[];
    messages: Message[];
    lastMessage: Message;
}
export declare const directory: string;
//# sourceMappingURL=chats.d.ts.map