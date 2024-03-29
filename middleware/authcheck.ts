import jwt from 'jsonwebtoken';

const authcheck = (req, res, next) => {
    let token = req.cookies?.token;
    if (req.path === '/user/login') {
        next();
    } else {
        if (token != undefined) {
            const user = jwt.verify(token, process.env.MY_SECRET);
            if (user) {
                console.log('User:' + user.toString() + ' asked for ' + req.path);
                req.user = user;
                next();
            }
        } else {
            res.status(418).json({ type: 'error', message: 'no authentication' });
        }
    }
};

export default authcheck;
