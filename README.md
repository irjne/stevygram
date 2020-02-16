# 📱 STEVYGRAM

Stevygram is a RESTfull and basic instant messaging service: it manages information of users, chats or groups and correlated messages. 
It uses a MongoDB database to store its data and runs on a NodeJS server.

Created by [@irjne](https://github.com/irjne), [@erocookv5](https://github.com/erocookv5), [@clacchisi](https://github.com/clacchisi), [@GlitchXCIV](https://github.com/GlitchXCIV), [@DarioLag96](https://github.com/Dariolag96)


## 📗 HOW TO USE
You can use this path to access to the resources: 

 - ***chats***
   - **GET** `https://stevygram.herokuapp.com/chats` > return all chats of the user in session;
   - **GET** `https://stevygram.herokuapp.com/chats/:id/users` > return all users of a specific chat, choosed by id;
   - **GET** `https://stevygram.herokuapp.com/chats/:id` > return informations of a specific chat, choosed by id;
   - **GET** `https://stevygram.herokuapp.com/chats/:id/messages` > return all messages of a specified chat, choosed by id;
   - **POST** `https://stevygram.herokuapp.com/chats` + body: {id, name, description?, users} > add a new chat;
   - **PUT** `https://stevygram.herokuapp.com/chats/:id` + body: {name?, description?} > modify informations of a specified chat, choosed by id;
   - **PUT** `https://stevygram.herokuapp.com/chats/:id/add-message` + body: {sender, body} > add a message in a specified chat, choosed by id; 
   - **DELETE** `https://stevygram.herokuapp.com/chats/:id` > remove a specified chat, choosed by id.

 - ***users***
   - **GET** `https://stevygram.herokuapp.com/users` > return all contacts of the user in session; 
   - **POST** `https://stevygram.herokuapp.com/users` + body: {phone, nickname?, name?, surname?} > add a new user in Stevygram;
   - **PUT** `https://stevygram.herokuapp.com/users/:id` + body: {name?, description?} > modify informations of a specified user, choosed by id;
   - **PUT** `https://stevygram.herokuapp.com/users/add-contact/:phone` > add a contact in a specified user's phonebook;
   - **DELETE** `https://stevygram.herokuapp.com/users/remove-contact/:phone` > remove a contact from an user's phonebook;
   - **DELETE** `https://stevygram.herokuapp.com/chats/:id` > remove a specified user, choosed by id.

## 📺 PRESENTATION 

[Stevygram](https://drive.google.com/file/d/10mCoeioAgRIoNKiJwrDZ8oqXUpWGqJ0Y/view?usp=sharing)


