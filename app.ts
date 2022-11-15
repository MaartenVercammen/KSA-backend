import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRouter from './routes/authRouter';
import userRouter from './routes/userRouter';
import magazineRouter from './routes/magazineRouter';
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
app.use(express.static('public'));

app.use(loggerMiddleware);

app.use('/uploads', express.static('uploads'));
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/magazine', magazineRouter);
app.use('/api/post', postRouter);

app.get('/status', (_req, res) => {
  res.json({ message: 'Backend is running...' });
});

app.listen(process.env.SERVER_PORT, () => {
  logger.info(`Server started on ${process.env.SERVER_PORT}`);
});
