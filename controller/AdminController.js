import jwt from "jsonwebtoken";

class AdminController {
    static AdminLogin = async (req, res, next) => {
        try {
            const {email, password} = req.body;
            const loginEnv = process.env.ADMIN_LOGIN;
            const passwordEnv = process.env.ADMIN_PASSWORD;
            if (email === loginEnv || password === password) {
                const token = jwt.sign({
                    isAdmin: true,
                    email: loginEnv,
                    password: passwordEnv
                }, process.env.JWT_SECRET);
                res.status(200).json({
                    token
                })
            } else {
                res.status(300).json({
                    error: 'Ты не пройдёшь!'
                })
            }
        } catch (e) {
            e.status = 401;
            next(e);
        }
    }
    //
}

export default AdminController;
