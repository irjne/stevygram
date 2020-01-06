import { promisify } from 'util';
import * as fs from 'fs';
import bcrypt from 'bcrypt';

export interface User {
    name: string;
    surname: string;
    nickname: string;
    phone: string;
    phonebook: string[];
}

export const directory = __dirname.replace("/lib", "/data");

export const addUser = async (nickname: string, name: string, surname: string, phone: string, password: string): Promise<string | any> => {
    try {
        const readFile = promisify(fs.readFile);
        const usersByFile = await readFile(directory + '/users.json', 'utf-8');
        const users = JSON.parse(usersByFile).users;
        for (let i = 0; i < users.length; i++) {
            if (phone == users[i].phone) {
                return `User ${phone} already exists.`;
            }
        }
        // hashing and salting password
        const salt = await bcrypt.genSalt(5);
        let hashedPassword = await bcrypt.hash(password, salt);
        let phonebook = new Array<string>();
        users.push({ nickname, name, surname, phone, phonebook, hashedPassword });
        let json = JSON.stringify({ "users": users });
        const writeFile = promisify(fs.writeFile);
        await writeFile(directory + '/users.json', json, 'utf-8');

        return `User ${nickname} added successfully.`;
    }
    catch (err) {
        console.error(err);
        return err;
    }
}

export const addInPhonebookByPhone = async (findByPhone: string, usersToAdd: string[]): Promise<object | any> => {
    try {
        const readFile = promisify(fs.readFile);
        const usersByFile = await readFile(directory + '/users.json', 'utf-8');
        const users = JSON.parse(usersByFile).users;

        for (let i = 0; i < users.length; i++) {
            if (findByPhone == users[i].phone) {
                for (let j = 0; j < usersToAdd.length; j++) {
                    users[i].phonebook.push(usersToAdd[j]);
                }
            }
        }

        let json = JSON.stringify(users);
        const writeFile = promisify(fs.writeFile);
        await writeFile(directory + '/users.json', json, 'utf-8');

        return `User ${findByPhone}'s phonebook was successfully updated.`;
    }
    catch (err) {
        return err;
    }
}

export const getAllUsers = async (findByName?: string): Promise<object | any> => {
    try {
        const readFile = promisify(fs.readFile);
        const usersByFile = await readFile(directory + '/users.json', 'utf-8');
        const users = JSON.parse(usersByFile).users;
        if (!findByName) return users;
        return users.filter((user: any) => {
            return user.name === findByName;
        })
    }
    catch (err) {
        return err;
    }
}

export const getPhonebookInfoByPhone = async (phone: string): Promise<User | any> => {
    try {
        const readFile = promisify(fs.readFile);
        const usersByFile = await readFile(directory + '/users.json', 'utf-8');
        const users = JSON.parse(usersByFile).users;
        let phonebook: string[] = [];
        for (let i = 0; i < users.length; i++) {
            if (phone == users[i].phone) {
                phonebook = users[i].phonebook;
            }
        }

        let phonebookInfo: User[] = [];
        for (let i = 0; i < phonebook.length; i++) {
            phonebookInfo.push(users.find((user: any) => phonebook[i] === user.phone));
        }

        return phonebookInfo;
    }
    catch (err) {
        console.error(err);
        return err;
    }
}

export const changeUserByPhone = async (phone: string, nickname?: string, name?: string, surname?: string): Promise<string | any> => {
    let isFounded = false;

    try {
        const readFile = promisify(fs.readFile);
        const usersByFile = await readFile(directory + '/users.json', 'utf-8');
        const users = JSON.parse(usersByFile).users;
        for (let i = 0; i < users.length; i++) {
            if (phone == users[i].phone) {
                if (nickname) users[i].nickname = nickname;
                if (name) users[i].name = name;
                if (surname) users[i].surname = surname;
                isFounded = true;
                break;
            }
        }

        if (isFounded) {
            let json = JSON.stringify(users);
            const writeFile = promisify(fs.writeFile);
            await writeFile(directory + '/users.json', json, 'utf-8');

            return `User ${nickname} (${phone}) changed successfully.`;
        }
        else { return `User \"${phone}\" not found.`; }
    }
    catch (err) {
        console.error(err);
        return err;
    }
}

export const removeUserByPhone = async (phone: string): Promise<string | any> => {
    try {
        const readFile = promisify(fs.readFile);
        const usersByFile = await readFile(directory + '/users.json', 'utf-8');
        const users = JSON.parse(usersByFile).users;

        for (let i = 0; i < users.length; i++) {
            if (phone == users[i].phone) {
                users.splice(i, 1);
                break;
            }
        }
        let json = JSON.stringify(users);
        const writeFile = promisify(fs.writeFile);
        await writeFile(directory + '/users.json', json, 'utf-8');
        return `User ${phone} removed successfully.`;
    }
    catch (err) {
        return err;
    }
}

export const findUserByPhone = async (phone: string): Promise<User> => {
    try {
        const readFile = promisify(fs.readFile);
        const users = JSON.parse(await readFile(directory + '/users.json', 'utf-8')).users;
        return users.find((user: any) => user.phone === phone);
    }
    catch (err) {
        return err;
    }
}