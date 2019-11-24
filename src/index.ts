import { promisify } from 'util';
import * as fs from 'fs';

export const addUser = (nickname: string, name: string, surname: string, phone: string): string | any  => {
    let obj = {
        users: Array<any>()
    };

    (async () => {
        try {
            const readFile = promisify(fs.readFile);
            const users = await readFile('users.json', 'utf-8');
            obj = JSON.parse(users);
            obj.users.push({nickname, name, surname, phone});
            let json = JSON.stringify(obj);
            const writeFile = promisify(fs.writeFile);
            const file = await writeFile('users.json', json, 'utf-8');

            return `User ${nickname} added successfully.`;
        }
        catch (err) {
            console.error(err);
            return err;
        }
    })();
}

export const addChat = (name: string, description: string, users: string[]): string | any => {
    let obj = {
        chats: Array<any>()
    };
    (async () => {
        try {
            const readFile = promisify(fs.readFile);
            const chats = await readFile('chats.json', 'utf-8');
            obj = JSON.parse(chats);
            obj.chats.push({name, description});
            let json = JSON.stringify(obj);
            const writeFile = promisify(fs.writeFile);
            const file = await writeFile('chats.json', json, 'utf-8');
            return `Chat ${name} added successfully.`;
        }
        catch (err) {
            return err;
        }
    })();
}

export const getAllChats = () => {
    let obj = {
        chats: Array<any>()
    };

    (async() => {
            try {
                const readFile = promisify(fs.readFile);
                const chats = await readFile('chats.json', 'utf-8');
                obj = JSON.parse(chats);
                return obj.chats;
            }
        catch (err) {
        return err; 
        }
    })
}

export const getAllUsers = () => {
    let obj = {
        users: Array<any>()
    };

    (async() => {
            try {
                const readFile = promisify(fs.readFile);
                const users = await readFile('users.json', 'utf-8');
                obj = JSON.parse(users);
                return obj.users;
            }
        catch (err) {
        return err; 
        }    
    })
}

export const getUsersByChatId = (id: number): string | any => {
    let obj = {
        chats: Array<any>()
    };

    (async () => {
        try {
            const readFile = promisify(fs.readFile);
            const chats = await readFile('chats.json', 'utf-8');
            obj = JSON.parse(chats);
            
            return obj.chats[id].users;
        }
        catch (err) {
            return err; 
        }
    })();
}

export const getInfoByChatId = (id: number): string[] | any => {
    let obj = {
        chats: Array<any>()
    };
    (async() => {
        try {
        const readFile = promisify(fs.readFile);
        const chats = await readFile('chats.json', 'utf-8');
        obj = JSON.parse(chats);
        return [obj.chats[id].name, obj.chats[id].description];
        }
        catch(err) {
            return err;
        }
    })();
}

export const getMessagesByChatId = (id: number): string | any => {
    let obj = {
        chats: Array<any>()
    };

    (async() => {
        try {
            const readFile = promisify(fs.readFile);
            const chats = await readFile('chats.json', 'utf-8');
            obj = JSON.parse(chats);
            let array= [];
            for (let i=0; i<chats[id].length; i++) {
                //for (let j=0; j<chats[id]) { per entrare nell'array dei messaggi
            // array.push(...);} 
            }
            return //array
        }
        catch(err) {
            return err;
        }
    })();
}

export const changeInfoByChatId = (id: number, name?: string, description?: string): string | any => {
    let obj = {
        chats: Array<any>()
    };

    (async () => {
        try {
            const readFile = promisify(fs.readFile);
            const chats = await readFile('chats.json', 'utf-8');
            obj = JSON.parse(chats);
            for (let i = 0; i < chats.length; i++) {
                if (id == obj.chats[i].id) {
                    if (name) obj.chats[i].name = name; 
                    if (description) obj.chats[i].description = description;
                }
            }
            let json = JSON.stringify(obj);
            const writeFile = promisify(fs.writeFile);
            const file = await writeFile('chats.json', json, 'utf-8');

            return `Chat ${name} changed successfully.`;
        }
        catch (err) {
            return err;
        }
    })();
}

export const changeUserByPhone = (phone: string, nickname?: string, name?: string, surname?: string): string | any => {
    let obj = {
        users: Array<any>()
    };

    (async () => {
        try {
            const readFile = promisify(fs.readFile);
            const chats = await readFile('users.json', 'utf-8');
            obj = JSON.parse(chats);
            for (let i = 0; i < chats.length; i++) {
                if (phone == obj.users[i].phone) {
                    if (nickname) obj.users[i].nickname = nickname;
                    if (name) obj.users[i].name = name; 
                    if (surname) obj.users[i].surname = surname;
                }
            }
            let json = JSON.stringify(obj);
            const writeFile = promisify(fs.writeFile);
            const file = await writeFile('users.json', json, 'utf-8');

            return `User ${nickname} (${phone}) changed successfully.`;
        }
        catch (err) {
            return err; 
        }
    })();
}

export const removeChatById = (id: number) => {
    let obj = {
        chats: Array<any>()
    };

    (async () => {
        try {
            const readFile = promisify(fs.readFile);
            const chats = await readFile('chats.json', 'utf-8');
            obj = JSON.parse(chats);
            for (let i=0; i<chats.length; i++) {
                if (id == obj.chats[i].id) {
                    delete(obj.chats[i]);
                }
            }
            let json = JSON.stringify(obj);
            const writeFile = promisify(fs.writeFile);
            const file = await writeFile('chats.json', json, 'utf-8');
        }
        catch (err) {
            console.log(err);
        }
    })();
}

export const removeUserByPhone = (phone: string) => {
    let obj = {
        users: Array<any>()
    };

    (async () => {
        try {
            const readFile = promisify(fs.readFile);
            const users = await readFile('users.json', 'utf-8');
            obj = JSON.parse(users);

            for (let i = 0; i < users.length; i++){
                if (phone == obj.users[i].phone) {
                    delete(obj.users[i]);
                }
            }
            let json = JSON.stringify(obj);
            const writeFile = promisify(fs.writeFile);
            const file = await writeFile('users.json', json, 'utf-8');
        }
        catch (err) {
            console.error(err);
        }
    })();
}