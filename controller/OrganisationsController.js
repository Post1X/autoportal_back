import Organisations from "../schemas/OrganisationsSchema";
import moment from "moment-timezone";
import Reviews from "../schemas/ReviewsSchema";
import Favorites from "../schemas/FavoritesSchema";
import Promotions from "../schemas/PromotionsSchema";

class OrganisationsController {
    static CreateOrganisation = async (req, res, next) => {
        try {
            const {
                name,
                typeServices,
                categoryId,
                brandsCars,
                city,
                address,
                mainPhone,
                whatsApp,
                employeers,
                description,
                schedule,
                logo,
                photos
            } = req.body;
            const {user_id} = req;
            const newOrganisation = new Organisations({
                dealer_id: user_id,
                name: name,
                typeServices: typeServices,
                categoryId: categoryId,
                brandsCars: brandsCars,
                city: city,
                address: address,
                mainPhone: mainPhone,
                whatsApp: whatsApp,
                employeers: employeers,
                description: description,
                schedule: schedule,
                photos: photos,
                logo: logo,
                rating: 0
            })
            await newOrganisation.save();
            res.status(200).json({
                organizationId: newOrganisation._id
            })
        } catch (e) {
            e.status = 401;
            next(e);
        }
    }
    //
    static GetOrganisation = async (req, res, next) => {
        try {
            const {user_id} = req;
            const organisations = await Organisations.find({
                dealer_id: user_id
            }).populate('dealer_id')
                .populate('categoryId')
                .populate('typeServices')
                .populate('brandsCars')
            let arr = [];
            await Promise.all(organisations.map(async (item) => {
                const favcount = await Favorites.count({
                    organisation_id: item._id
                });
                const countreviews = await Reviews.count({
                    organisation_id: item._id
                });
                const promo = await Promotions.findOne({
                    organizationId: item._id
                });
                arr.push({
                    _id: item._id,
                    logo: item.logo,
                    name: item.name,
                    address: item.address,
                    categoryName: item.categoryId,
                    rating: item.rating,
                    isSubscribe: item.subscription_status,
                    isActive: item.is_active,
                    countFavorites: favcount,
                    isBaned: item.is_banned,
                    countReviews: countreviews,
                    promo: promo ? {
                        description: promo.description,
                        startPromo: promo.startPromo,
                        endPromo: promo.endPromo
                    } : null
                });
            }))
            res.status(200).json(arr);
        } catch (e) {
            e.status = 401;
            next(e);
        }
    }
    //
    static UpdateOrganisation = async (req, res, next) => {
        try {
            const {
                name,
                typeServices,
                categoryId,
                brandsCars,
                city,
                address,
                mainPhone,
                whatsApp,
                employeers,
                description,
                schedule,
                logo,
                photos
            } = req.body;
            const {user_id} = req;
            const {organisation_id} = req.query;
            await Organisations.findOneAndUpdate({
                _id: organisation_id
            }, {
                dealer_id: user_id,
                name: name,
                typeServices: typeServices,
                categoryId: categoryId,
                brandsCars: brandsCars,
                city: city,
                address: address,
                mainPhone: mainPhone,
                whatsApp: whatsApp,
                employeers: employeers,
                description: description,
                schedule: schedule,
                photos: photos,
                logo: logo
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
    static DeleteOrganisation = async (req, res, next) => {
        try {
            const {organisation_id} = req.query;
            await Organisations.findOneAndDelete({
                _id: organisation_id
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
    static GetSingleOrganisation = async (req, res, next) => {
        try {
            const {id} = req.query;
            const {user_id} = req;
            const reviews = await Reviews.find({
                organisation_id: id
            });
            const final_rating = reviews.map((item) => {
                return Number(item.rating);
            });
            let organisation = {};
            const sum = final_rating.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
            const rating = Math.round(sum / final_rating.length);
            const countreviews = await Reviews.count({
                organisation_id: id
            });
            const isFav = await Favorites.findOne({
                client_id: user_id,
                organisation_id: id
            })
            const promo = await Promotions.findOne({
                organizationId: id
            });
            const lastReview = await Reviews.findOne({
                organisation_id: id
            }).sort({createdAt: 1});
            const orgdto = await Organisations.findOne({
                _id: id
            })
                .populate('dealer_id')
                .populate('categoryId')
                .populate('typeServices')
                .populate('brandsCars');
            organisation._id = orgdto._id;
            organisation.logo = orgdto.logo;
            organisation.name = orgdto.name;
            organisation.address = orgdto.address;
            organisation.categoryId = orgdto.categoryId;
            organisation.rating = rating;
            organisation.countReviews = countreviews;
            organisation.isFavorite = !!isFav;
            organisation.description = orgdto.description;
            organisation.city = orgdto.city;
            organisation.photos = orgdto.photos;
            organisation.promo = promo ? {
                description: promo.description,
                startPromo: promo.startPromo,
                endPromo: promo.endPromo
            } : null;
            organisation.mainPhone = orgdto.mainPhone;
            organisation.whatsApp = orgdto.whatsApp;
            organisation.employeers = orgdto.employeers;
            organisation.services = orgdto.typeServices;
            organisation.brandsCars = orgdto.brandsCars;
            organisation.schedule = orgdto.schedule;
            organisation.lastReview = lastReview;
            organisation.dealerId = orgdto.dealer_id._id;
            organisation.dealerCity = orgdto.dealer_id.city;
            res.status(200).json({
                organisation
            });
        } catch (e) {
            e.status = 401;
            next(e);
        }
    }
    static FilterOrganisation = async (req, res, next) => {
        try {
            moment.locale('ru');
            const currentDate = new Date();
            const hours = currentDate.getHours();
            const minutes = currentDate.getMinutes();
            const timeZone = 'Asia/Yerevan';
            const currentTime = moment().tz(timeZone).format('HH:mm')
            const dayOfWeek = moment().format('dddd');
            const todayDay = dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1)
            const {scheduleFilter, city, categoryId, servicesId, brandsCarsId, sortType} = req.body;
            const filter = {};
            filter.is_active = true;
            filter.is_banned = false;
            let sort = 1;
            if (city) {
                filter.city = city;
            }
            if (categoryId) {
                filter.categoryId = {$in: categoryId}
            }
            if (servicesId) {
                filter.typeServices = {$in: servicesId}
            }
            if (brandsCarsId) {
                const brandsCarsIdArray = Array.isArray(brandsCarsId) ? brandsCarsId : [brandsCarsId];
                filter.brandsCars = {$in: brandsCarsIdArray};
            }
            if (sortType) {
                if (sortType === "ratingASC") {
                    sort = 1;
                } else if (sortType === "ratingDESC") {
                    sort = -1;
                }
            }
            const days_ids = [];
            const query = await Organisations.find(filter).sort({rating: sort});
            const final_array = [];
            if (scheduleFilter) {
                for (const obj of query) {
                    if (obj.schedule && Array.isArray(obj.schedule)) {
                        const dayObjects = obj.schedule.map(entry => {
                            const day = entry.title;
                            const from = entry.from !== undefined ? entry.from : null;
                            const to = entry.to !== undefined ? entry.to : null;
                            const all_day = entry.isAllDay !== undefined ? entry.isAllDay : null;
                            return {
                                day,
                                from,
                                to,
                                all_day
                            };
                        }).filter(entry => entry.day);
                        days_ids.push({
                            id: obj._id,
                            days: dayObjects
                        });
                    }
                }
                await Promise.all(days_ids.map(async (item) => {
                    if (scheduleFilter.Days && scheduleFilter.isAllDay) {
                        const days = scheduleFilter.Days;
                        for (const day of days) {
                            if (item.days.some(dayItem => dayItem.day === day) && item.days.some(dayItem => dayItem.all_day === true)) {
                                final_array.push(await Organisations.find({
                                    _id: item.id,
                                    filter
                                })
                                    .sort({rating: sort})
                                    .populate('dealer_id')
                                    .populate('categoryId')
                                    .populate('typeServices')
                                    .populate('brandsCars'));
                            }
                        }
                    }

                    if (scheduleFilter.Days && !scheduleFilter.isAllDay) {
                        const days = scheduleFilter.Days;
                        for (const day of days) {
                            if (item.days.some(dayItem => dayItem.day === day)) {
                                final_array.push(await Organisations.find({
                                    _id: item.id,
                                    filter
                                })
                                    .sort({rating: sort})
                                    .populate('dealer_id')
                                    .populate('categoryId')
                                    .populate('typeServices')
                                    .populate('brandsCars'));
                            }
                        }
                    }

                    if (scheduleFilter.isAllDay && !scheduleFilter.Days) {
                        const days = item.days;
                        const todayObj = item.days.filter(day => day.all_day === true);
                        if (todayObj.some(dayObj => dayObj.day === todayDay)) {
                            for (const dayItem of days) {
                                final_array.push(await Organisations.find({
                                    _id: item.id,
                                    filter
                                })
                                    .sort({rating: sort})
                                    .populate('dealer_id')
                                    .populate('categoryId')
                                    .populate('typeServices')
                                    .populate('brandsCars'));
                            }
                        }
                    }
                    if (scheduleFilter.isNowWork) {
                        for (const dayItem of item.days) {
                            if (dayItem.all_day === true && item.days.some(day => day.day === todayDay) && currentTime >= dayItem.from && currentTime <= dayItem.to) {
                                final_array.push(await Organisations.find({
                                    _id: item.id,
                                    filter
                                }).sort({rating: sort})
                                    .populate('dealer_id')
                                    .populate('categoryId')
                                    .populate('typeServices')
                                    .populate('brandsCars'))
                            }
                        }
                    }
                }));
                const modifiedOrganisations = await Promise.all(final_array.map(async (item) => {
                    const countreviews = await Reviews.count({
                        organisation_id: item._id
                    });
                    const reviews = await Reviews.find({
                        organisation_id: item._id
                    });
                    const final_rating = reviews.map((item) => {
                        return Number(item.rating);
                    });
                    const sum = final_rating.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
                    const rating = Math.round(sum / final_rating.length);
                    return {
                        ...item[0].toObject(),
                        rating: rating,
                        countReviews: countreviews
                    };
                }));
                res.status(200).json(modifiedOrganisations);
            }
            if (!scheduleFilter) {
                final_array.push(...await Organisations.find(
                    filter
                ).sort({rating: sort})
                    .populate('dealer_id')
                    .populate('categoryId')
                    .populate('typeServices')
                    .populate('brandsCars'));
                const modifiedOrganisations = await Promise.all(final_array.map(async (item) => {
                    const reviews = await Reviews.find({
                        organisation_id: item._id
                    });
                    const countreviews = await Reviews.count({
                        organisation_id: item._id
                    });
                    const final_rating = reviews.map((item) => {
                        return Number(item.rating);
                    });
                    const sum = final_rating.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
                    const rating = Math.round(sum / final_rating.length);
                    return {
                        ...item.toObject(),
                        rating: rating,
                        countReviews: countreviews
                    };
                }));
                res.status(200).json(modifiedOrganisations);
            }
            if (final_array.length === 0) {
                res.status(300).json({
                    error: 'Список организаций пуст.'
                });
            }
        } catch (e) {
            e.status = 401;
            next(e);
        }
    }

//
    static
    GetPromotions = async (req, res, next) => {
        try {

        } catch (e) {
            e.status = 401;
            next(e);
        }
    }
//
    static
    isCreated = async (req, res, next) => {
        try {
            const {user_id} = req;
            const orgToCheck = await Organisations.find({
                dealer_id: user_id
            });
            if (orgToCheck.length === 0) {
                res.status(200).json({
                    createdStatus: false
                })
            }
            if (orgToCheck.length >= 1) {
                res.status(200).json({
                    createdStatus: true
                })
            }
        } catch (e) {
            e.status = 401;
            next(e);
        }
    }
    //
    static deletePhotos = async (req, res, next) => {
        try {
            const {photo, organisationId} = req.query;
            const updatedOrganisations = await Organisations.findByIdAndUpdate(
                organisationId,
                {$pull: {photos: photo}},
                {new: true}
            );
            if (!updatedOrganisations) {
                return res.status(404).json({
                    error: 'Товар не найден'
                });
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
    static uploadImage = async (req, res, next) => {
        try {
            const file = req.files.find(file => file.fieldname === 'file');
            const parts = file.path.split('public');
            const finalFile = `http://194.67.125.33:3001/${parts[1].substring(1)}`;
            res.status(200).json(
                finalFile
            )
        } catch (e) {
            e.status = 401;
            next(e);
        }
    }
}


export default OrganisationsController;
