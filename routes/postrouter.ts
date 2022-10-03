import express from 'express';
import authcheck from '../middleware/authcheck';
import dotenv from 'dotenv';
import path from 'path';
import roleCheck from '../middleware/roleCheck';
import { Post, Roles } from '../types';
import * as postModel from '../model/postModel';

dotenv.config({
    path: path.join(__dirname, `../.env.${process.env.NODE_ENV}`),
});

const postrouter = express.Router();

postrouter.get('/', (req, res) => {
    postModel.getPost((posts, err) => {
        if (err) {
            res.status(500).json({ type: 'error', message: err.message });
        } else {
            res.status(200).json(posts);
        }
    });
});
postrouter.post('/', authcheck, roleCheck(Roles.ADMIN, Roles.BONDS, Roles.BRAGGEL), (req, res) => {
    const post: Post = req.body;
    console.log(req.body);
    postModel.uploadPost(post, (err) => {
        if (err) {
            res.status(500).json({ type: 'error', message: err.message });
        } else {
            res.status(200).json({ type: 'ok', message: 'post uploaded' });
        }
    });
});

export default postrouter;
