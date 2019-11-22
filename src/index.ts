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
            const info = await readFile('info.json', 'utf-8');
            obj = JSON.parse(info);
            obj.users.push({nickname, name, surname, phone});
            let json = JSON.stringify(obj);
            const writeFile = promisify(fs.writeFile);
            const file = await writeFile('info.json', json, 'utf-8');
        }
        catch (err) {
            console.error(err);
        }
    })();
}

addUser("MainframeTv", "Gabriele", "Connelli", "+393482523775");