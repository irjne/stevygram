import express from 'express';

//Cannot find name 'require'. 
//Do you need to install type definitions for node? Try `npm i @types/node`.
const users = require('./routes/users');
const chats = require('./routes/chats');
//installare npm i @types/node per togliere questo errore

const app = express();

app.use('/users', users);
app.use('/chats', chats);

app.listen(3001, () => console.log('Server running!'));