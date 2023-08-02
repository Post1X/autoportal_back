import Clients from "../schemas/ClientsSchema";
import argon2 from 'argon2'
import jwt from "jsonwebtoken";

class ClientsController {
    static RegisterClient = async (req, res, next) => {
        try {
            const {full_name, phone_number, city, email, password, conf_password} = req.body;
            if (password !== conf_password) {
                res.status(300).json({
                    error: 'Пароли не совпадают.'
                })
            } else {
                const hashedPassword = await argon2.hash(password);
                const newClients = new Clients({
                    full_name: full_name,
                    phone_number: phone_number,
                    city: city,
                    email: email,
                    password: hashedPassword
                })
                await newClients.save();
                res.status(200).json({
                    message: 'success'
                })
            }
        } catch (e) {
            e.status = 401;
            next(e);
        }
    }
    //
    static LoginClient = async (req, res, next) => {
        try {
            const {email, password} = req.body;
            const user = await Clients.findOne({
                email: email
            })
                .select('full_name')
                .select('phone_number')
                .select('city')
                .select('email')
            const token = jwt.sign({
                phone_number: user.phone_number,
                user_id: user._id,
                email: user.email
            }, process.env.JWT_SECRET);
            if (!user) {
                res.status(300).json({
                    error: 'Пользователь не найден. Проверьте введённые данные.'
                })
            }
            if (!await argon2.verify(user.password, password)) {
                res.status(300).json({
                    error: 'Неправильный пароль.'
                })
            }
            if (await argon2.verify(user.password, password)) {
                res.status(200).json({
                    token: token,
                    userData: user
                })
            } else {
                res.status(400).json({
                    error: 'Непредвиденная ошибка, свяжитесь с администрацией'
                })
            }
        } catch (e) {
            e.status = 401;
            next(e);
        }
    }
    //
    static GetProfile = async (req, res, next) => {
        try {
            const {user_id} = req;
            const user = await Clients.findOne({
                _id: user_id
            })
                .select('full_name')
                .select('phone_number')
                .select('city')
                .select('email')
            res.status(200).json(
                user
            )
        } catch (e) {
            e.status = 401;
            next(e);
        }
    }
}

export default ClientsController;
