import mongoose from 'mongoose';

export interface Chat extends mongoose.Document {
    id: number;
    name: string;
    description: string;
    admin: string[];
    users: string[];
    messages: Object[];
    lastMessage: Object
}

export interface Message {
    sender: string;
    body: string;
    date: Date;
}