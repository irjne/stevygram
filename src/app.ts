import express from 'express';
const users = require('./routes/users');
const chats = require('./routes/chats');

const app = express();

app.use('/users', users);
app.use('/chats', chats);

app.listen(3001, () => console.log('Server running!'));