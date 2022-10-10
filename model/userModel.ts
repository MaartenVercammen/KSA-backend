import { connectionPool } from '../database';
import { user } from '../types';
const { createHash } = require('crypto');

function hash(string) {
    return createHash('sha256').update(string).digest('hex');
}

async function getUsers(onResult: (users: user[], err: Error) => void) {
    const query =
        'select u.id as id, u.name as name, email as email, r.name as role from ksa.user as u inner join ksa.roles as r on u.role = r.id';
    try {
        var { rows } = await connectionPool.query(query);
        onResult(<user[]>rows, null);
    } catch (error) {
        onResult(null, error);
    }
}

async function postUser(user: user, onResult: (err: Error) => void) {
    const query =
        'insert into ksa.user (name, password, email, role) values ($1,$2,$3, (select id from ksa.roles where name = $4))';
    try {
        await connectionPool.query(query, [user.name, hash(user.password), user.email, user.role]);
        onResult(null);
    } catch (error) {
        onResult(error);
    }
}

async function updateUser(user: user, onResult: (err: Error) => void) {
    const queryWithPassword =
        'update ksa.user set name = $1, email = $2, password = $3, role = (select id from ksa.roles where name = $4) where id = $5';
    const queryWithoutPassword =
        'update ksa.user set name = $1, email = $2, role = (select id from ksa.roles where name = $4) where id = $5';
    const query = user.password == '' ? queryWithoutPassword : queryWithPassword;
    console.log(query);
    try {
        await connectionPool.query(query, [
            user.name,
            user.email,
            hash(user.password),
            user.role,
            user.id,
        ]);
        onResult(null);
    } catch (error) {
        onResult(error);
    }
}

const deleteUser = async (id: number, onResult: (err: Error) => void) => {
    const query = 'delete from ksa.user where id = $1';
    try {
        await connectionPool.query(query, [id]);
        onResult(null);
    } catch (error) {
        onResult(error);
    }
};

async function login(
    email: string,
    password: string,
    onResult: (user: Array<user>, err: Error) => void
) {
    const query =
        'select u.id, u.name, email, r.name as role from ksa.user as u inner join ksa.roles as r on u.role = r.id where u.email = $1 and u.password = $2';
    try {
        const hashedpassword = hash(password);
        console.log(hashedpassword);
        var { rows } = await connectionPool.query(query, [email, hashedpassword]);
        onResult(rows, null);
    } catch (error) {
        onResult(null, error);
    }
}

export { getUsers, login, postUser, deleteUser, updateUser };
