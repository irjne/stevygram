import { promisify } from 'util';
import * as fs from 'fs';

export interface User {
    name: string;
    surname: string;
    nickname: string;
    phone: string;
}

export const directory = __dirname.replace("/lib", "/data");

export const addUser = async (nickname: string, name: string, surname: string, phone: string): Promise<string | any> => {
    let obj = {
        users: Array<any>()
    };

    try {
        const readFile = promisify(fs.readFile);
        const users = await readFile(directory + '/users.json', 'utf-8');
        obj = JSON.parse(users);
        let exists = false;

        for (let i = 0; i < obj.users.length; i++) {
            if (phone == obj.users[i].phone) {
                return `User ${phone} already exists.`;
            }
        }

        obj.users.push({ nickname, name, surname, phone });
        let json = JSON.stringify(obj);
        const writeFile = promisify(fs.writeFile);
        await writeFile(directory + '/users.json', json, 'utf-8');

        return `User ${nickname} added successfully.`;
    }
    catch (err) {
        console.error(err);
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

export const changeUserByPhone = async (phone: string, nickname?: string, name?: string, surname?: string): Promise<string | any> => {
    let obj = {
        users: Array<any>()
    };

    let isFounded = false;

    try {
        const readFile = promisify(fs.readFile);
        const users = await readFile(directory + '/users.json', 'utf-8');
        obj = JSON.parse(users);
        for (let i = 0; i < obj.users.length; i++) {
            if (phone == obj.users[i].phone) {
                if (nickname) obj.users[i].nickname = nickname;
                if (name) obj.users[i].name = name;
                if (surname) obj.users[i].surname = surname;
                isFounded = true;
                break;
            }
        }

        if (isFounded) {
            let json = JSON.stringify(obj);
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
    let obj = {
        users: Array<any>()
    };

    try {
        const readFile = promisify(fs.readFile);
        const users = await readFile(directory + '/users.json', 'utf-8');
        obj = JSON.parse(users);

        for (let i = 0; i < obj.users.length; i++) {
            if (phone == obj.users[i].phone) {
                obj.users.splice(i, 1);
                break;
            }
        }
        let json = JSON.stringify(obj);
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