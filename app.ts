import express from 'express';
import cors from 'cors';
import path from 'path';
import cookieParser from 'cookie-parser';
import authRouter from './routes/authRouter';
import userRouter from './routes/userRouter';
import fileRouter from './routes/fileRouter';
import postRouter from './routes/postRouter';
import { loggerMiddleware } from './modules/middlewares';
import newLogger from './modules/logger';

const logger = newLogger();

const app = express();

// TODO review default middlewares
app.use(
  cors({
    credentials: true,
    origin: process.env.ORIGIN,
  }),
);
app.use(express.json());
app.use(express.urlencoded({
  extended: true,
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(loggerMiddleware);

app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use('/uploads', express.static('uploads'));
app.use('/auth', authRouter);
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
