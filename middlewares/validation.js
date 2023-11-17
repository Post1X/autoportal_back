import jwt from 'jsonwebtoken';
//
const EXCLUDE = ['/register/client', '/login/client/make-call', '/login/client/confirm', '/register/dealer', '/login/dealer','/login/guest', '/login/admin', '/login', '/login/dealer/make-call', '/login/dealer/confirm', '/find']

const authorization = async (req, res, next) => {
    try {
        const {authorization = ''} = req.headers;
        const {originalUrl, method} = req;
        if (method === 'OPTIONS' || EXCLUDE.includes(req.path)) {
            next();
            return;
        }
        if (!authorization) {
            next();
        }
        const {JWT_SECRET} = process.env;
        const token = authorization.replace('Bearer ', '');
        const userInfo = jwt.verify(token, JWT_SECRET);
        req.user_id = userInfo.user_id;
        if (userInfo.isAdmin) {
            req.isAdmin = userInfo.isAdmin
        }
        if (userInfo.isDealer) {
            req.isDealer = userInfo.isDealer
        }
        if (userInfo.isGuest) {
            req.isGuest = userInfo.isGuest
        }
        next();
    } catch (e) {
        e.status = 401;
        next(e);
    }
}

export default authorization;


