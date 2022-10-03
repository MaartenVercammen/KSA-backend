import * as dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import * as bodyParser from 'body-parser';
import userRouter from './routes/userRouter';
import fileRouter from './routes/fileRouter';
import path from 'path';
import cookieParser from 'cookie-parser';
import postrouter from './routes/postrouter';

dotenv.config({ path: path.join(__dirname, `./.env.${process.env.NODE_ENV}`) });

const app = express();

app.use(
    cors({
        credentials: true,
        origin: process.env.ORIGIN,
    })
);
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use('/user', userRouter);
app.use('/file', fileRouter);
app.use('/post', postrouter);

app.get('/status', (req, res) => {
    res.json({ message: 'Backend is running...' });
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(process.env.APP_PORT, () => {
    console.log(`Server is running on port ${process.env.APP_PORT}.`);
});
