import jwt from "jsonwebtoken";
import Dealers from "../schemas/DealersSchema";
import Organisations from "../schemas/OrganisationsSchema";
import Categories from "../schemas/CategoriesSchema";
import Services from "../schemas/ServicesSchema";
import Subscription from "../schemas/SubscriptionSchema";
import Images from "../schemas/ImageSchema";
import Oferta from "../schemas/OfertaSchema";

class AdminController {
    static AdminLogin = async (req, res, next) => {
        try {
            const {phone, password} = req.body;
            const phoneNumber = process.env.ADMIN_NUMBER;
            const passwordEnv = process.env.ADMIN_PASSWORD;
            if (phone === phoneNumber && password === passwordEnv) {
                const token = jwt.sign({
                    isAdmin: true,
                    phone_number: phoneNumber,
                    password: passwordEnv
                }, process.env.JWT_SECRET);
                res.status(200).json({
                    token
                })
            } else {
                res.status(300).json({
                    message: 'error'
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
            const {name, isBanned, city, phone, dealerId} = req.query;
            const filter = {};

            if (name)
                filter.full_name = name;
            if (isBanned)
                filter.is_banned = isBanned;
            if (city)
                filter.city = city;
            if (phone)
                filter.phone_number = phone;
            if (dealerId) {
                filter.dealer_id = dealerId;
                filter.city = city;
                const user = await Dealers.findOne({
                    _id: dealerId
                });
                const organisations = await Organisations.count({dealer_id: user._id});
                res.status(200).json([{
                    dealer: user,
                    organisation_count: organisations
                }])
            }
            const usersArray = await Dealers.find(filter);
            console.log(usersArray)
            const finalArray = await Promise.all(usersArray.map(async (dealer) => {
                const organisations = await Organisations.find({dealer_id: dealer._id});
                const userOrganisations = organisations.filter(org => org.dealer_id.toString() === dealer._id.toString());
                return {
                    dealer: dealer,
                    organisation_count: userOrganisations.length
                };
            }));

            res.status(200).json(finalArray);
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
                _id: dealerId
            }, {
                is_banned: !dealer.is_banned
            });
            await Organisations.deleteMany({
                dealer_id: dealerId
            })
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
            const {month_amount, year_amount, free_period} = req.body;
            const sub = await Subscription.find();
            const percentage = Math.round(((year_amount - month_amount * 12) / (month_amount * 12)) * 100);
            if (sub.length === 0) {
                const newSub = new Subscription({
                    month_amount: month_amount,
                    year_amount: year_amount,
                    free_period: free_period,
                    percentage: -(percentage)
                });
                await newSub.save();
            }
            if (sub) {
                await Subscription.updateMany({
                    month_amount: month_amount,
                    year_amount: year_amount,
                    free_period: free_period,
                    percentage: -(percentage)
                })
            }
            res.status(200).json({
                message: 'success'
            });
        } catch (e) {
            e.status = 401;
            next(e);
        }
    }
    //
    static getUsersOrg = async (req, res, next) => {
        try {
            const {dealerId} = req.query;
            const organisations = await Organisations.find({
                dealer_id: dealerId
            });
            res.status(200).json(organisations);
        } catch (e) {
            e.status = 401;
            next(e);
        }
    }
    //
    static getContacts = async (req, res, next) => {
        try {
            res.status(200).json({
                orderBanner: process.env.ORDERBANNER,
                report: process.env.REPORT
            })
        } catch (e) {
            e.status = 401;
            next(e);
        }
    }
    //
    static uploadFile = async (req, res, next) => {
        try {
            const offer = req.files.find(file => file.fieldname === 'offer');
            const policy = req.files.find(file => file.fieldname === 'policy');
            const offerPart = offer.path.split('public');
            const policyPart = policy.path.split('public');
            const finalOffer = `http://194.67.125.33:3001/${offerPart[1].substring(1)}`;
            const finalPolicy = `http://194.67.125.33:3001/${policyPart[1].substring(1)}`;
            console.log(finalOffer, 'finalOffer');
            console.log(finalPolicy, 'finalPolicy');
            const newImage = new Oferta({
                offer: finalOffer,
                policy: finalPolicy
            });
            await newImage.save();
            res.status(200).json(
                {
                    message: 'ok'
                }
            )
        } catch (e) {
            e.status = 401;
            next(e);
        }
    }
    //
    static getOferta = async (req, res, next) => {
        try {
            const file = await Oferta.findOne();
            res.status(200).json(file.offer);
        } catch (e) {
            e.status = 401;
            next(e);
        }
    }
    //
    static getPolicy = async (req, res, next) => {
        try {
            const file = await Oferta.findOne();
            res.status(200).json(file.policy);
        } catch (e) {
            e.status = 401;
            next(e);
        }
    }
}

export default AdminController;
