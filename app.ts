import express from 'express';
import cors from 'cors';
import * as bodyParser from 'body-parser';
import path from 'path';
import cookieParser from 'cookie-parser';
import userRouter from './routes/userRouter';
import fileRouter from './routes/fileRouter';
import postRouter from './routes/postRouter';

const logger = require('./modules/logger')();

const app = express();

app.use(
  cors({
    credentials: true,
    origin: process.env.ORIGIN,
  }),
);
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use('/user', userRouter);
app.use('/file', fileRouter);
app.use('/post', postRouter);

app.get('/status', (_req, res) => {
  res.json({ message: 'Backend is running...' });
});

app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(process.env.SERVER_PORT, () => {
  logger.info(`Server started on ${process.env.SERVER_PORT}`);
});
