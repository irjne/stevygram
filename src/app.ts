import express from 'express';
import users from "./routes/users";
import chats from './routes/chats';

const app = express();

app.use('/users', users);
app.use('/chats', chats);

app.listen(3001, () => console.log('🙌 Server is running!'));