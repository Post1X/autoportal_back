import jwt from "jsonwebtoken";
import Dealers from "../schemas/DealersSchema";
import Organisations from "../schemas/OrganisationsSchema";
import Categories from "../schemas/CategoriesSchema";
import Services from "../schemas/ServicesSchema";
import Subscription from "../schemas/SubscriptionSchema";

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
    static getUsers = async (req, res, next) => {
        try {
            const {name, isBanned, city, phone} = req.query;
            const filter = {};
            if (name) {
                filter.full_name = name;
            }
            if (isBanned) {
                filter.is_banned = isBanned;
            }
            if (city) {
                filter.city = city;
            }
            if (phone) {
                filter.phone_number = phone;
            }
            const usersArray = await Dealers.find(filter);
            const array = [];
            const finalArray = await Promise.all(usersArray.map(async (dealer) => {
                const organisations = await Organisations.find({});
                const userOrganisations = organisations.filter((org) => org.dealer_id.toString() === dealer._id.toString());
                if (userOrganisations.length > 0) {
                    array.push(userOrganisations);
                }
                return {
                    dealer: dealer,
                    organisation_count: userOrganisations.length
                };
            }));
            res.status(200).json(finalArray)
        } catch (e) {
            e.status = 401;
            next(e);
        }
    }
    //
    static banUser = async (req, res, next) => {
        try {
            const {dealerId} = req.query;
            const dealer = await Dealers.findOne({
                _id: dealerId
            })
            await Dealers.findOneAndUpdate({
                is_banned: !dealer.is_banned
            });
            res.status(200).json({
                message: 'success'
            })
        } catch (e) {
            e.status = 401;
            next(e);
        }
    }
    //
    static getOrganisations = async (req, res, next) => {
        try {
            const {isBanned} = req.query;
            const filter = {};
            if (isBanned) {
                filter.is_banned = isBanned;
            }
            const organisations = await Organisations.find(filter);
            res.status(200).json(organisations)
        } catch (e) {
            e.status = 401;
            next(e);
        }
    }
    //
    static getCategories = async (req, res, next) => {
        try {
            const categories = await Categories.find({});
            const array = await Promise.all(categories.map(async (cat) => {
                const serv = await Services.find({
                    category_id: cat._id,
                    is_extended: false
                });
                const filterServices = serv.filter((item) => item.category_id.toString() === cat._id.toString());
                const extServices = await Promise.all(filterServices.map(async (item) => {
                    const toReturn = await Services.find({service_id: item._id})
                    return toReturn;
                }));
                return {
                    category: cat,
                    services: filterServices,
                    extServices: extServices
                };
            }));
            res.status(200).json(array);
        } catch (e) {
            e.status = 401;
            next(e);
        }
    }
    //
    static createSub = async (req, res, next) => {
        try {
            const {amount, duration} = req.body;
            const sub = await Subscription.find();
            if (!sub) {
                const newSub = new Subscription({
                    amount: amount,
                    free_period: duration
                });
                await newSub.save();
            }
            if (sub) {
                await Subscription.updateMany({
                    amount: amount,
                    free_period: duration
                })
            }
            ;
            res.status(200).json({
                message: 'success'
            });
        } catch (e) {
            e.status = 401;
            next(e);
        }
    }
}

export default AdminController;