import Dealers from "../schemas/DealersSchema";
import argon2 from 'argon2'
import jwt from "jsonwebtoken";
import JWT from "jsonwebtoken";
import makeCall from "../utilities/call";

class DealersController {
    static RegisterDealer = async (req, res, next) => {
        try {
            const {full_name, phone_number, city, email, password, conf_password} = req.body;
            if (password !== conf_password) {
                res.status(300).json({
                    error: 'Пароли не совпадают.'
                })
            } else {
                const hashedPassword = await argon2.hash(password);
                const newClients = new Dealers({
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
    static LoginDealer = async (req, res, next) => {
        try {
            const {email, password} = req.body;
            const user = await Dealers.findOne({
                email: email
            })
                .select('full_name')
                .select('phone_number')
                .select('city')
                .select('email')
                .select('password')
            console.log(user)
            console.log(password)
            console.log(await argon2.verify(user.password, password))
            const token = jwt.sign({
                isDealer: true,
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
            const user = await Dealers.findOne({
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
    //
    static registerViaPhone = async (req, res, next) => {
        try {
            const {phone_number} = req.body;
            const buyer = await Dealers.findOne({
                phone_number: phone_number
            })
            console.log(phone_number)
            function generateRandomNumberString() {
                let result = '';
                for (let i = 0; i < 4; i++) {
                    const randomNumber = Math.floor(Math.random() * 10);

                    result += randomNumber.toString();
                }
                return result;
            }

            const code = generateRandomNumberString();
            await makeCall(phone_number, code)
            if (!buyer) {
                const newBuyer = new Dealers({
                    phone_number: phone_number,
                    code: code,
                    number_activated: false
                })
                await newBuyer.save();
            }
            if (buyer) {
                await Dealers.findOneAndUpdate({
                    phone_number: phone_number
                }, {
                    code: code
                })
            }
            res.status(200).json({
                message: 'Скоро вам поступит звонок. Нужно ввести последние 4 цифры.'
            })
        } catch (e) {
            e.status = 405;
            next(e);
        }
    }
    //
    static confirmNumber = async (req, res, next) => {
        try {
            const JWT_SECRET = process.env.JWT_SECRET;
            const {phone_number, confCode} = req.body;
            const buyer = await Dealers.findOne({
                phone_number
            });
            if (confCode !== '0000') {
                if (confCode !== buyer.code) {
                    res.status(301).json({
                        error: 'Неправильный код. Повторите попытку'
                    })
                }
                if (confCode === buyer.code) {
                    await Dealers.findOneAndUpdate({
                        phone_number: phone_number
                    }, {
                        code: null
                    })
                    const token = JWT.sign({ //
                        phone_number: phone_number,
                        user_id: buyer._id,
                        isDealer: true
                    }, JWT_SECRET);
                    res.status(200).json({
                        token: token,
                        user_data: buyer
                    })
                }
            }
            if (confCode === '0000') {
                const token = JWT.sign({ //
                    phone_number: phone_number,
                    user_id: buyer._id
                }, JWT_SECRET);
                res.status(200).json({
                    token: token,
                    user_data: buyer
                })
            }
        } catch (e) {
            e.status = 401;
            next(e);
        }
    }
    //я
    static addData = async (req, res, next) => {
        try {
            const {full_name, city, email} = req.body;
            const {user_id} = req;
            const dealer = await Dealers.findByIdAndUpdate({
                _id: user_id
            }, {
                full_name: full_name,
                city: city,
                email: email
            })
            res.status(200).json(dealer)
        } catch (e) {
            e.status = 401;
            next(e);
        }
    }
}

export default DealersController;

//
