import { connectionPool } from '../database';
import { Post } from '../types';

const getPost = async (onResult: (posts: Post[], err: Error) => void) => {
    const query = 'select * from ksa.post';
    try {
        var { rows } = await connectionPool.query(query);
        onResult(<Post[]>rows, null);
    } catch (error) {
        onResult(null, error);
    }
};

const uploadPost = async (post: Post, onResult: (err: Error) => void) => {
    const query = 'insert into ksa.post (title, content, date) values ($1,$2,$3)';
    try {
        await connectionPool.query(query, [post.title, post.content, post.date]);
        onResult(null);
    } catch (error) {
        onResult(error);
    }
};

export { getPost, uploadPost };
