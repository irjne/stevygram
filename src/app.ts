import express from 'express';
import users from "./routes/users";
import chats from './routes/chats';
import bodyParser from 'body-parser';

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/users', users);
app.use('/chats', chats);

app.listen(3003, () => console.log('🙌 Server is running!'));
module.exports = app;