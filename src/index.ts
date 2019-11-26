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
        await writeFile(__dirname + '/users.json', json, 'utf-8');

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
        const chats = await readFile(__dirname + '/chats.json', 'utf-8');
        obj = JSON.parse(chats);

        obj.chats.push({ id, name, description, users });
        let json = JSON.stringify(obj);
        const writeFile = promisify(fs.writeFile);
        await writeFile(__dirname + '/chats.json', json, 'utf-8');
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
        const chats = await readFile(__dirname + '/chats.json', 'utf-8');
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
        const users = await readFile(__dirname + '/users.json', 'utf-8');
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
        const chats = await readFile(__dirname + '/chats.json', 'utf-8');
        obj = JSON.parse(chats);

        if (id > obj.chats.length - 1) return false;
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
        const chats = await readFile(__dirname + '/chats.json', 'utf-8');
        obj = JSON.parse(chats);

        if (id > obj.chats.length - 1) return false;
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
        const chats = await readFile(__dirname + '/chats.json', 'utf-8');
        obj = JSON.parse(chats);

        if (id > obj.chats.length - 1) return false;
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
        const chats = await readFile(__dirname + '/chats.json', 'utf-8');
        obj = JSON.parse(chats);

        if (id > obj.chats.length - 1) return false;
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
            await writeFile(__dirname + '/chats.json', json, 'utf-8');

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
                break;
            }
        }

        if (isFounded) {
            let json = JSON.stringify(obj);
            const writeFile = promisify(fs.writeFile);
            await writeFile(__dirname + '/users.json', json, 'utf-8');

            return `User ${nickname} (${phone}) changed successfully.`;
        }
        else { return `User \"${phone}\" not found.`; }
    }
    catch (err) {
        console.error(err);
        return err;
    }
}

export const searchByChatId = async (id: number, sender?: string, word?: string): Promise<string | any> => {
    let obj = {
        chats: Array<any>()
    };
    let choice = -1;

    try {
        const readFile = promisify(fs.readFile);
        const chats = await readFile(__dirname + '/chats.json', 'utf-8');
        obj = JSON.parse(chats);
        if (id > obj.chats.length - 1) return false;

        if (sender) choice = 0;
        else if (word) choice = 1;

        let isFounded = false;
        let result = {
            messages: Array<any>()
        };

        switch (choice) {
            case 0:
                // search by sender
                for (let i = 0; i < obj.chats.length; i++) {
                    if (id == obj.chats[i].id) {
                        for (let j = 0; j < obj.chats[i].messages.length; j++) {
                            if (sender == obj.chats[i].messages[j].sender) {
                                result.messages[result.messages.length] = {
                                    "body": obj.chats[i].messages[j].body,
                                    "date": obj.chats[i].messages[j].date
                                }

                                isFounded = true;
                            }
                        }
                    }
                }
                break;

            case 1:
                // search by word
                for (let i = 0; i < obj.chats.length; i++) {
                    if (id == obj.chats[i].id) {
                        for (let j = 0; j < obj.chats[i].messages.length; j++) {
                            if (obj.chats[i].messages[j].body.includes(word)) {
                                result.messages[result.messages.length] = {
                                    "sender": obj.chats[i].messages[j].sender,
                                    "body": obj.chats[i].messages[j].body,
                                    "date": obj.chats[i].messages[j].date
                                }

                                isFounded = true;
                            }
                        }
                    }
                }
                break;
        }

        if (isFounded) {
            return result;
        }
        else {
            if (choice == 0) return `The research by user (${sender}) reported 0 results.`;
            else return `The research by word (${word}) reported 0 results.`;
        }
    }
    catch (err) {
        return err;
    }
}

export const removeChatById = async (id: number): Promise<string | any> => {
    let obj = {
        chats: Array<any>()
    };

    try {
        const readFile = promisify(fs.readFile);
        const chats = await readFile(__dirname + '/chats.json', 'utf-8');
        obj = JSON.parse(chats);
        if (id > obj.chats.length - 1) return false;

        for (let i = 0; i < obj.chats.length; i++) {
            if (id == obj.chats[i].id) {
                obj.chats.splice(i, 1);
                break;
            }
        }
        let json = JSON.stringify(obj);
        const writeFile = promisify(fs.writeFile);
        await writeFile(__dirname + '/chats.json', json, 'utf-8');
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
        const users = await readFile(__dirname + '/users.json', 'utf-8');
        obj = JSON.parse(users);

        for (let i = 0; i < obj.users.length; i++) {
            if (phone == obj.users[i].phone) {
                obj.users.splice(i, 1);
                break;
            }
        }
        let json = JSON.stringify(obj);
        const writeFile = promisify(fs.writeFile);
        await writeFile(__dirname + '/users.json', json, 'utf-8');
        return `User ${phone} removed successfully.`;
    }
    catch (err) {
        return err;
    }
}