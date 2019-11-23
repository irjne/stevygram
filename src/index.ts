import { promisify } from 'util';
import * as fs from 'fs';
import { userInfo } from 'os';

/*export interface User {
    nickname: string, 
    name: string,
    surname: string,
    phone: string
}*/

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

export const addChat = (name: string, description: string, users: string[]) => {
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
        }
        catch (err) {
            console.log(err);
        }
    })();
}

export const getAllChats = () => {
    let obj = {
        chats: Array<any>()
    };
    (async() => {
        const readFile = promisify(fs.readFile);
        const chats = await readFile('chats.json', 'utf-8');
        obj = JSON.parse(chats);
        let array= [];
        for (let i=0; i< chats.length; i++) {
           // ? array.push(chats[chats[i]]);
        }
         // ? return array;
    })
}
export const getAllUsers = () => {
    let obj = {
        users: Array<any>()
    };
    (async() => {
        const readFile = promisify(fs.readFile);
        const users = await readFile('users.json', 'utf-8');
        obj = JSON.parse(users);
        let array= [];
        for (let i=0; i<users.length; i++) {
            // ? array.push(users[users[i]]);
        }
         // ? return array;
    })
}
export const getUsersByChatId = (id: number): string[] | any => {
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

export const getInfoByChatId = (id: number) => {
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
export const getMessagesByChatId = (id: number) => {
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
        return //array;
    }
    catch(err) {
        return err;
    }
})();
}

export const changeInfoByChatId = (id: number, name: string, description: string) => {}
export const changeUserByPhone = (nickname: string, name: string, surname: string, phone: string) => {}

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
               // if (id == chats[]) {
               //     obj.chats[id].delete();//??
               // }
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
            for (let i=0; i<users.length; i++){
                if (phone == phone[i]) {
                    obj.users[i].delete();//??
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