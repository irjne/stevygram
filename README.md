# 📱 STEVYGRAM

Stevygram is a basilar version of Telegram: it manages information of users, chats and correlated messages. 
It uses JSON files to store its data; its APIs are based on REST paradigm.  

Created by [@irjne](https://github.com/irjne), [@clacchisi](https://github.com/clacchisi), [@GlitchXCIV](https://github.com/GlitchXCIV), [@DarioLag96](https://github.com/Dariolag96)


## 📕 STRUCTURE


All methods belong to the *index.ts* library.
In particular, they are:
 - `addUser  =  async (nickname:  string, name:  string, surname:  string, phone:  string):  Promise<string  |  any>`: allows to add a new user in the Stevygram DB; 
 - `addChat  =  async (id:  number, name:  string, description:  string, users:  string[]):  Promise<string  |  any>`: allows to add a new chat in the Stevygram DB;
 - `getAllChats  =  async ():  Promise<object  |  any`: returns all chats, as the name suggests 😝;
 - `getAllUsers  =  async ():  Promise<object  |  any>`: returns all users, as the name suggests;
 - `getUsersByChatId  =  async (id:  number):  Promise<object  |  any>`: returns all users of a specific chat (selected by id); 
 - `getInfoByChatId  =  async (id:  number):  Promise<object[] |  any>`: returns info (name, description) of a specific chat (selected by id); 
 - `getMessagesByChatId  =  async (id:  number):  Promise<object  |  any>`: returns relative info (sender, body, date) of all messages of a specific chat (selected by id);
 - `changeInfoByChatId  =  async (id:  number, name?:  string, description?:  string):  Promise<string  |  any>`:  modifies the reported informations of a specific chat (selected by id); 
 - `changeUserByPhone  =  async (phone:  string, nickname?:  string, name?:  string, surname?:  string):  Promise<string  |  any>`: modifies the expressed informations of a specific user (selected by phone); 
 - `searchByChatId  =  async (id:  number, sender?:  string, word?:  string):  Promise<string  |  any>`: returns the chat information (id, name, messages and users) if exists;
 - `removeChatById  =  async (id:  number):  Promise<string  |  any>`: deletes a specified chat from Stevygram DB;
 - `removeUserByPhone  =  async (phone:  string):  Promise<string  |  any>`: deletes a specified user from Stevygram DB.


## 📗 HOW TO USE
▶️ Run `npm start` if you want to run it manually

▶️ Run `npm run dev` if you want to use nodemon

☑️ Run `npm run test` if you want to test APIs


## 📘 PATH, HERE WE ARE!
You can use this path to access to the resources: 

 - ***chats***
   - **GET** `/chats`: all chats in Stevygram;
   - **GET** `/chats/:id/users`: all users of a specified chat;
   - **GET** `/chats/:id`: all info of a specified chat;
   - **GET** `/chats/:id/messages`: all messages of a specified chat;
   - **POST** `/chats` + {id, name, description, users} : add a new chat;
   - **PUT** `/chats/:id` +{name?, description?}: modifies info of a specified chat;
   - **DELETE** `/chats/:id`: remove a specified chat.

 - ***users***
   - **GET** `/users`: all users in Stevygram;
   - **POST** `/users` + {phone, nickname?, name?, surname?} : add a new user;
   - **PUT** `/users/:id` +{name?, description?}: modifies info of a specified chat;
   - **DELETE** `/chats/:id`: remove a specified user.



