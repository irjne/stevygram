import { promisify } from 'util';
import { User, findUserByPhone } from './users';
import * as fs from 'fs';

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
    lastMessage: Message

}

export const directory = __dirname.replace("/lib", "/data");

export const addChat = async (id: number, name: string, description: string, users: string[]): Promise<string | any> => {
    let obj = {
        chats: Array<any>()
    };

    try {
        const readFile = promisify(fs.readFile);
        const chats = await readFile(directory + '/chats.json', 'utf-8');
        obj = JSON.parse(chats);

        obj.chats.push({ id, name, description, users });
        let json = JSON.stringify(obj);
        const writeFile = promisify(fs.writeFile);
        await writeFile(directory + '/chats.json', json, 'utf-8');
        return `Chat \"${name}\" added successfully.`;

    }
    catch (err) {
        return err;
    }
}

export const getAllChats = async (user?: User): Promise<Chat[]> => {
    try {
        const readFile = promisify(fs.readFile);
        let chats: Chat[] = JSON.parse(await readFile(directory + '/chats.json', 'utf-8')).chats as Chat[];
        if (user) {
            chats = chats.filter(chat => {
                return chat.users.includes(user.phone)
            })
            chats = await Promise.all(chats.map(async chat => {
                if (chat.users.length === 2) {
                    const otherUserPhone = user.phone === chat.users[0] ? chat.users[1] : chat.users[0];
                    const otherUser = await findUserByPhone(otherUserPhone);
                    chat.name = `${otherUser.name} ${otherUser.surname}`;
                }
                return chat;
            }))
        }
        return Promise.all(chats.map(async chat => {
            const lastMessage = chat.messages.pop() as Message;
            delete chat.users;
            delete chat.messages;
            chat.lastMessage = lastMessage;
            chat.lastMessage.sender = await findUserByPhone(chat.lastMessage.sender as string);
            return chat;
        }));
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
        const chats = await readFile(directory + '/chats.json', 'utf-8');
        obj = JSON.parse(chats);

        if (id > obj.chats.length - 1) return false;
        return { users: obj.chats[id].users };
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
        const chats = await readFile(directory + '/chats.json', 'utf-8');
        obj = JSON.parse(chats);

        if (id > obj.chats.length - 1) return false;
        //return [obj.chats[id].name, obj.chats[id].description];
        return { name: obj.chats[id].name, description: obj.chats[id].description, users: obj.chats[id].users, messages: obj.chats[id].messages };
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
        const chats = await readFile(directory + '/chats.json', 'utf-8');
        obj = JSON.parse(chats);

        if (id > obj.chats.length - 1) return false;
        return { messages: obj.chats[id].messages };
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
        const chats = await readFile(directory + '/chats.json', 'utf-8');
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
            await writeFile(directory + '/chats.json', json, 'utf-8');

            return `Chat ${name} changed successfully.`;
        }
        else { return `Chat ${name} not found.`; }
    }
    catch (err) {
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
        const chats = await readFile(directory + '/chats.json', 'utf-8');
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
        const chats = await readFile(directory + '/chats.json', 'utf-8');
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
        await writeFile(directory + '/chats.json', json, 'utf-8');
        return `Chat \"${id}\" removed successfully.`;
    }
    catch (err) {
        return err;
    }
}