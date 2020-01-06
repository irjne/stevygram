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

//? creates a new chat in stevygram environment 
export const addChat = async (id: number, name: string, description: string, users: string[]): Promise<string | any> => {
    try {
        const readFile = promisify(fs.readFile);
        const chatsByFile = await readFile(directory + '/chats.json', 'utf-8');
        const chats = JSON.parse(chatsByFile).chats;

        chats.push({ id, name, description, users });
        let json = JSON.stringify(chats);
        const writeFile = promisify(fs.writeFile);
        await writeFile(directory + '/chats.json', json, 'utf-8');
        return `Chat \"${name}\" added successfully.`;

    }
    catch (err) {
        return err;
    }
}

//? returns all the chats of stevygram or of a specific user (by entity)
export const getAllChats = async (user?: User): Promise<Chat[]> => {
    try {
        const readFile = promisify(fs.readFile);
        const chatsByFile = await readFile(directory + '/chats.json', 'utf-8');
        let chats: Chat[] = JSON.parse(chatsByFile).chats;
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

//? returns all users of a specific chat (by id)
export const getUsersByChatId = async (id: number): Promise<object | any> => {
    try {
        const readFile = promisify(fs.readFile);
        const chatsByFile = await readFile(directory + '/chats.json', 'utf-8');
        const chats = JSON.parse(chatsByFile).chats;

        if (id > chats.length - 1) return false;
        return { users: chats[id].users };
    }
    catch (err) {
        return err;
    }
}

//? returns all chat info of a specific chat (by id)
export const getInfoByChatId = async (id: number, user?: User): Promise<object[] | any> => {
    try {
        const readFile = promisify(fs.readFile);
        const chatsByFile = await readFile(directory + '/chats.json', 'utf-8');
        const chats = JSON.parse(chatsByFile).chats;

        if (id > chats.length - 1) return false;

        const chat = chats[id];
        let chatName: string;
        if (user) {
            let contacts: string[] = [];
            for (let i = 0; i < chat.users.length; i++) {
                let contact = chat.users[i];
                let contactInfo = await findUserByPhone(contact);
                if (contact != user.phone && user.phonebook.includes(contact)) {
                    contacts.push(" " + contactInfo.name + " " + contactInfo.surname);
                }
                else if (contact != user.phone) contacts.push(" " + contactInfo.nickname);
            }

            let messages: Message[] = [];
            for (let i = 0; i < chat.messages.length; i++) {
                let message = chat.messages[i];
                let sender = await findUserByPhone(message.sender);
                if (sender.phone != user.phone && user.phonebook.includes(sender.phone)) {
                    messages.push({ sender: sender.name + " " + sender.surname, body: message.body, date: message.date });
                }
                else if (sender.phone != user.phone) messages.push({ sender: sender.nickname, body: message.body, date: message.date });
                else messages.push({ sender: "Me", body: message.body, date: message.date });
            }

            if (chat.users.length === 2) {
                const otherUserPhone = user.phone === chat.users[0] ? chat.users[1] : chat.users[0];
                const otherUser = await findUserByPhone(otherUserPhone);
                chatName = `${otherUser.name} ${otherUser.surname}`;
                return { name: chatName, description: chat.description, users: contacts, messages: messages };
            }
            else return { name: chat.name, description: chat.description, users: contacts, messages: messages };
        }
        else return { name: chat.name, description: chat.description, users: chat.users, messages: chat.messages };
    }
    catch (err) {
        return err;
    }
}

//? returns all messages of a specific chat (by id)
export const getMessagesByChatId = async (id: number): Promise<object | any> => {
    try {
        const readFile = promisify(fs.readFile);
        const chatsByFile = await readFile(directory + '/chats.json', 'utf-8');
        const chats = JSON.parse(chatsByFile).chats;

        if (id > chats.length - 1) return false;
        return { messages: chats[id].messages };
    }
    catch (err) {
        return err;
    }
}

//? modifies chat info of a specific chat (by id)
export const changeInfoByChatId = async (id: number, name?: string, description?: string): Promise<string | any> => {
    let isFounded = false;

    try {
        const readFile = promisify(fs.readFile);
        const chatsByFile = await readFile(directory + '/chats.json', 'utf-8');
        const chats = JSON.parse(chatsByFile);

        if (id > chats.length - 1) return false;
        for (let i = 0; i < chats.length; i++) {
            if (id == chats[i].id) {
                if (name) chats[i].name = name;
                if (description) chats[i].description = description;
                isFounded = true;
                break;
            }
        }

        if (isFounded) {
            let json = JSON.stringify(chats);
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

//? returns a specific chat (by id)
export const searchByChatId = async (id: number, sender?: string, word?: string): Promise<string | any> => {
    let choice = -1;

    try {
        const readFile = promisify(fs.readFile);
        const chatsByFile = await readFile(directory + '/chats.json', 'utf-8');
        const chats = JSON.parse(chatsByFile);
        if (id > chats.length - 1) return false;

        if (sender) choice = 0;
        else if (word) choice = 1;

        let isFounded = false;
        let result = {
            messages: Array<any>()
        };

        switch (choice) {
            case 0:
                // search by sender
                for (let i = 0; i < chats.length; i++) {
                    if (id == chats[i].id) {
                        for (let j = 0; j < chats[i].messages.length; j++) {
                            if (sender == chats[i].messages[j].sender) {
                                result.messages[result.messages.length] = {
                                    "body": chats[i].messages[j].body,
                                    "date": chats[i].messages[j].date
                                }

                                isFounded = true;
                            }
                        }
                    }
                }
                break;

            case 1:
                // search by word
                for (let i = 0; i < chats.length; i++) {
                    if (id == chats[i].id) {
                        for (let j = 0; j < chats[i].messages.length; j++) {
                            if (chats[i].messages[j].body.includes(word)) {
                                result.messages[result.messages.length] = {
                                    "sender": chats[i].messages[j].sender,
                                    "body": chats[i].messages[j].body,
                                    "date": chats[i].messages[j].date
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

//? deletes a specific chat (by id)
export const removeChatById = async (id: number): Promise<string | any> => {
    try {
        const readFile = promisify(fs.readFile);
        const chatsByFile = await readFile(directory + '/chats.json', 'utf-8');
        const chats = JSON.parse(chatsByFile).chats;
        if (id > chats.length - 1) return false;

        for (let i = 0; i < chats.length; i++) {
            if (id == chats[i].id) {
                chats.splice(i, 1);
                break;
            }
        }
        let json = JSON.stringify(chats);
        const writeFile = promisify(fs.writeFile);
        await writeFile(directory + '/chats.json', json, 'utf-8');
        return `Chat \"${id}\" removed successfully.`;
    }
    catch (err) {
        return err;
    }
}