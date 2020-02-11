import express from 'express';
//import users from "./routes/users";
//import chats from './routes/chats';
import mongooseUsers from './routes/mongooseUsers'
import mongooseChats from './routes/mongooseChats'
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//app.use('/users', users);
//app.use('/chats', chats);
app.use('/mongooseUsers', mongooseUsers);
app.use('/mongooseChats', mongooseChats);

app.listen(3005, () => console.log('🙌 Server is running!'));
module.exports = app;