import { promisify } from 'util';
import * as fs from 'fs';

export const addUser = async (nickname: string, name: string, surname: string, phone: string): Promise<string | any> => {
    let obj = {
        users: Array<any>()
    };

    try {
        const readFile = promisify(fs.readFile);
        const users = await readFile(__dirname + '/users.json', 'utf-8');
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
        const file = await writeFile(__dirname + '/users.json', json, 'utf-8');

        return `User ${nickname} added successfully.`;
    }
    catch (err) {
        console.error(err);
        return err;
    }
}

export const addChat = async (id: number, name: string, description: string, users: string[]): Promise<string | any> => {
    let obj = {
        chats: Array<any>()
    };

    try {
        const readFile = promisify(fs.readFile);
        const chats = await readFile(__dirname +'chats.json', 'utf-8');
        obj = JSON.parse(chats);

        obj.chats.push({ id, name, description, users });
        let json = JSON.stringify(obj);
        const writeFile = promisify(fs.writeFile);
        const file = await writeFile(__dirname +'chats.json', json, 'utf-8');
        return `Chat \"${name}\" added successfully.`;

    }
    catch (err) {
        return err;
    }
}

export const getAllChats = async (): Promise<object | any> => {
    let obj = {
        chats: Array<any>()
    };

    try {
        const readFile = promisify(fs.readFile);
        const chats = await readFile(__dirname +'chats.json', 'utf-8');
        obj = JSON.parse(chats);
        return obj;
    }
    catch (err) {
        return err;
    }
}

export const getAllUsers = async (): Promise<object | any> => {
    let obj = {
        users: Array<any>()
    };


    try {
        const readFile = promisify(fs.readFile);
        const users = await readFile(__dirname +'users.json', 'utf-8');
        obj = JSON.parse(users);
        return obj.users;
    }
    catch (err) {
        return err;
    }
}

export const getUsersByChatId = async (id: number): Promise<object | any> => {
    let obj = {
        chats: Array<any>()
    };

    try {
        const readFile = promisify(fs.readFile);
        const chats = await readFile(__dirname +'chats.json', 'utf-8');
        obj = JSON.parse(chats);
        return obj.chats[id].users;
    }
    catch (err) {
        return err;
    }
}

export const getInfoByChatId = async (id: number): Promise<object[] | any> => {
    let obj = {
        chats: Array<any>()
    };

    try {
        const readFile = promisify(fs.readFile);
        const chats = await readFile(__dirname +'chats.json', 'utf-8');
        obj = JSON.parse(chats);
        return [obj.chats[id].name, obj.chats[id].description];
    }
    catch (err) {
        return err;
    }
}

export const getMessagesByChatId = async (id: number): Promise<object | any> => {
    let obj = {
        chats: Array<any>()
    };

    try {
        const readFile = promisify(fs.readFile);
        const chats = await readFile(__dirname +'chats.json', 'utf-8');
        obj = JSON.parse(chats);
        console.log(obj.chats[id].messages);
        return obj.chats[id].messages;
    }
    catch (err) {
        return err;
    }
}

export const changeInfoByChatId = async (id: number, name?: string, description?: string): Promise<string | any> => {
    let obj = {
        chats: Array<any>()
    };

    let isFounded = false;

    try {
        const readFile = promisify(fs.readFile);
        const chats = await readFile(__dirname +'chats.json', 'utf-8');
        obj = JSON.parse(chats);
        for (let i = 0; i < obj.chats.length; i++) {
            if (id == obj.chats[i].id) {
                if (name) obj.chats[i].name = name;
                if (description) obj.chats[i].description = description;
                isFounded = true;
                break;
            }
        }

        if (isFounded) {
            let json = JSON.stringify(obj);
            const writeFile = promisify(fs.writeFile);
            const file = await writeFile(__dirname +'chats.json', json, 'utf-8');

            return `Chat ${name} changed successfully.`;
        }
        else { return `Chat ${name} not found.`; }
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
        const users = await readFile(__dirname + '/users.json', 'utf-8');
        obj = JSON.parse(users);
        for (let i = 0; i < obj.users.length; i++) {
            if (phone == obj.users[i].phone) {
                if (nickname) obj.users[i].nickname = nickname;
                if (name) obj.users[i].name = name;
                if (surname) obj.users[i].surname = surname;
                isFounded = true;
            }
        }

        if (isFounded) {
            let json = JSON.stringify(obj);
            const writeFile = promisify(fs.writeFile);
            const file = await writeFile(__dirname + '/users.json', json, 'utf-8');

            return `User ${nickname} (${phone}) changed successfully.`;
        }
        else { return `User \"${phone}\" not found.`; }
    }
    catch (err) {
        console.error(err);
        return err;
    }
}

export const removeChatById = async (id: number): Promise<string | any> => {
    let obj = {
        chats: Array<any>()
    };

    try {
        const readFile = promisify(fs.readFile);
        const chats = await readFile(__dirname +'chats.json', 'utf-8');
        obj = JSON.parse(chats);
        for (let i = 0; i < obj.chats.length; i++) {
            if (id == obj.chats[i].id) {
                obj.chats.splice(i, 1);
                break;
            }
        }
        let json = JSON.stringify(obj);
        const writeFile = promisify(fs.writeFile);
        const file = await writeFile(__dirname +'chats.json', json, 'utf-8');
        return `Chat \"${id}\" removed successfully.`;
    }
    catch (err) {
        return err;
    }
}

export const removeUserByPhone = async (phone: string): Promise<string | any> => {
    let obj = {
        users: Array<any>()
    };

    try {
        const readFile = promisify(fs.readFile);
        const users = await readFile(__dirname +'users.json', 'utf-8');
        obj = JSON.parse(users);

        for (let i = 0; i < obj.users.length; i++) {
            if (phone == obj.users[i].phone) {
                obj.users.splice(i, 1);
                break;
            }
        }
        let json = JSON.stringify(obj);
        const writeFile = promisify(fs.writeFile);
        const file = await writeFile(__dirname +'users.json', json, 'utf-8');
        return `User ${phone} removed successfully.`;
    }
    catch (err) {
        return err;
    }
}