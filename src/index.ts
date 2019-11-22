import { promisify } from 'util';
import * as fs from 'fs';
import { userInfo } from 'os';

/*export interface User {
    nickname: string, 
    name: string,
    surname: string,
    phone: string
}*/

export const addUser = (nickname: string, name: string, surname: string, phone: string): any  => {
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
        }
        catch (err) {
            console.error(err);
        }
    })();
}

export const addChat = (name: string, description: string) => {}

export const getAllChats = () => {}
export const getAllUsers = () => {}
export const getUsersByChatId = (id: number): any => {
    let obj = {
        users: Array<any>()
    };

    (async () => {
        try {
            const readFile = promisify(fs.readFile);
            const users = await readFile('chats.json', 'utf-8');
            obj = JSON.parse(users);
            
            console.log(obj.users);
        }
        catch (err) {
            console.error(err);
        }
    })();
}

export const getInfoByChatId = (id: number) => {}
export const getMessagesByChatId = (id: number) => {}

export const changeInfoByChatId = (id: number, name: string, description: string) => {}
export const changeUserByPhone = (nickname: string, name: string, surname: string, phone: string) => {}

export const removeChatById = (id: number) => {}
export const removeUserByPhone = (phone: string) => {}

//getUsersByChatId(2);