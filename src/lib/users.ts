import mongoose from 'mongoose';

// Extended User interface with mongoose.Document
export interface User extends mongoose.Document {
    name: string, // all these "," were ";" once (Matteo)
    surname: string,
    nickname: string,
    phone: string,
    password: string,
    phonebook: string[]
}