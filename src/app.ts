import express from 'express';
import users from './routes/users'
import chats from './routes/chats'
import main from './routes/main'
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/', main);
app.use('/users', users);
app.use('/chats', chats);

app.listen(process.env.PORT || 3005, () => console.log('🙌 Server is running!'));
module.exports = app;