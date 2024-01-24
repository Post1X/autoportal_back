import Organisations from "../schemas/OrganisationsSchema";
import moment from "moment-timezone";
import Reviews from "../schemas/ReviewsSchema";
import Favorites from "../schemas/FavoritesSchema";
import Promotions from "../schemas/PromotionsSchema";
import Reports from "../schemas/ReportsSchema";
import Banners from "../schemas/BannersSchema";
import Services from "../schemas/ServicesSchema";

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
                rating: 0,
                free_period: true
            })
            console.log(name,
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
                logo);
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
                        endPromo: promo.endPromo,
                        _id: promo._id
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
            console.log(schedule);
            const organisation = await Organisations.findOne({
                _id: organisation_id
            });
            let services = {};
            //
            if (typeServices.length === 0)
                services.typeServices = null;
            //
            if (typeServices.typeServices > 0)
                services.typeServices = typeServices
            //
            const existingSchedule = organisation.schedule || [];
            const updatedSchedule = existingSchedule.map(existingEntry => {
                const newEntry = schedule.find(entry => entry.title === existingEntry.title);
                return newEntry ? newEntry : existingEntry;
            });
            const deletedDays = existingSchedule.filter(existingEntry => !schedule.some(entry => entry.title === existingEntry.title));
            const finalSchedule = updatedSchedule.filter(entry => !deletedDays.some(deleted => deleted.title === entry.title));
            await Organisations.findOneAndUpdate({_id: organisation_id}, {
                dealer_id: user_id,
                name,
                typeServices: services.typeServices,
                categoryId,
                brandsCars,
                city,
                address,
                mainPhone,
                whatsApp,
                employeers,
                description,
                schedule: schedule,
                photos,
                logo
            });
            res.status(200).json({
                message: 'success'
            });
        } catch (e) {
            e.status = 401;
            next(e);
        }
    };
    //
    static DeleteOrganisation = async (req, res, next) => {
        try {
            const {organisation_id} = req.query;
            await Organisations.findOneAndDelete({
                _id: organisation_id
            })
            await Promotions.deleteMany({
                organizationId: organisation_id
            })
            await Favorites.deleteMany({
                organisation_id: organisation_id
            });
            await Reports.deleteMany({
                organizationId: organisation_id
            });
            await Reviews.deleteMany({
                organizationId: organisation_id
            });
            await Banners.deleteMany({
                organisation_id: organisation_id
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
                client_id: user_id, organisation_id: id
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
            const orgdto_mapped = await Promise.all(orgdto.typeServices.map(async (item) => {
                let extservice;
                let head_service;
                if (!!item.is_extended === true) {
                    extservice = await Services.findOne({
                        _id: item._id
                    });
                    head_service = await Services.findOne({
                        _id: item.service_id
                    });
                }
                if (item.is_extended === false) {
                    head_service = await Services.findOne({
                        _id: item._id
                    })
                }
                return {
                    service: head_service,
                    ext_services: extservice
                };
            }));
            const newArray = orgdto_mapped.map(item => {
                return {...item, ext_services: typeof item.ext_services !== 'undefined' ? item.ext_services : null};
            });
            const groupedServices = {};
            newArray.forEach(item => {
                const {service, ext_services} = item;
                const serviceId = service._id.toString();
                if (!groupedServices[serviceId]) {
                    groupedServices[serviceId] = {
                        service,
                        ext_services: [],
                    };
                }
                if (ext_services) {
                    groupedServices[serviceId].ext_services.push(ext_services);
                }
            });
            const result = Object.values(groupedServices);
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
                description: promo.description, startPromo: promo.startPromo, endPromo: promo.endPromo
            } : null;
            organisation.mainPhone = orgdto.mainPhone;
            organisation.whatsApp = orgdto.whatsApp;
            organisation.employeers = orgdto.employeers;
            organisation.services = result;
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
            const currentTime = moment().tz(timeZone).format('HH:mm');
            const dayOfWeek = moment().format('dddd');
            const todayDay = dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1);
            const {scheduleFilter, city, categoryId, servicesId, brandsCarsId, sortType} = req.body;
            const filter = {};
            let isRandom = true;
            filter.is_active = true;
            filter.is_banned = false;
            let sort = 1;
            if (city) {
                filter.city = city;
            }
            if (categoryId) {
                filter.categoryId = {$in: categoryId};
            }
            if (servicesId) {
                filter.typeServices = {$in: servicesId};
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
                isRandom = false;
            }
            const organisations = await Organisations.find(filter).sort({rating: sort})
            const filteredOrganisations = organisations.filter(org => {
                if (scheduleFilter && scheduleFilter.isAllDay) {
                    return org.schedule.some(day => day.isAllDay);
                }
                if (scheduleFilter && scheduleFilter.Days) {
                    return scheduleFilter.Days.some(day => org.schedule.some(orgDay => orgDay.title === day));
                }
                return true;
            });
            const modifiedOrganisations = await Promise.all(filteredOrganisations.map(async (item) => {
                const countreviews = await Reviews.count({organisation_id: item._id});
                const reviews = await Reviews.find({organisation_id: item._id});
                const final_rating = reviews.map(item => Number(item.rating));
                const sum = final_rating.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
                const rating = Math.round(sum / final_rating.length);
                return {
                    ...item.toObject(), rating: rating, countReviews: countreviews
                };
            }));
            if (scheduleFilter && scheduleFilter.isNowWork) {
                function capitalizeFirstLetter(string) {
                    return string.charAt(0).toUpperCase() + string.slice(1);
                }

                let todayDay;
                const nowWorkingOrgs = modifiedOrganisations.filter(org => org.schedule.some(day => {
                    console.log(day.title, todayDay);
                    let from;
                    let to;
                    let current;
                    todayDay = capitalizeFirstLetter(new Date().toLocaleString('ru', {weekday: 'long'}).toLowerCase());
                    if (day.from)
                        from = day.from.split(':').map(Number);
                    console.log(day.title, todayDay);
                    if (day.to)
                        to = day.to.split(':').map(Number);
                    current = currentTime.split(':').map(Number);
                    if (day.isAllDay && day.title === todayDay) {
                        console.log('sasi penis');
                        return true;
                    }
                    if (day.title === todayDay && isTimeInRange(current, from, to)) {
                        console.log(day.title, todayDay, isTimeInRange(current, to, from))
                        console.log('sasi xuy');
                        return true;
                    }
                    return false;
                }));
                if (isRandom === true) {
                    nowWorkingOrgs.sort(() => Math.random() - 0.5);
                }
                return res.status(200).json(nowWorkingOrgs);

                function isTimeInRange(current, from, to) {
                    if (from && to) {
                        if (from[0] < to[0]) {
                            return (current[0] > from[0] || (current[0] === from[0] && current[1] >= from[1])) && (current[0] < to[0] || (current[0] === to[0] && current[1] <= to[1]));
                        } else if (from[0] === to[0]) {
                            return (current[0] === from[0] && current[1] >= from[1] && current[1] <= to[1]);
                        } else {
                            return (current[0] > from[0] || (current[0] === from[0] && current[1] >= from[1])) || (current[0] < to[0] || (current[0] === to[0] && current[1] <= to[1]));
                        }
                    }
                    return false;
                }
            } else if (modifiedOrganisations.length >= 0) {
                if (isRandom === true) {
                    modifiedOrganisations.sort(() => Math.random() - 0.5);
                    res.status(200).json(modifiedOrganisations);
                } else res.status(200).json(modifiedOrganisations);
            }
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
            const updatedOrganisations = await Organisations.findByIdAndUpdate(organisationId, {$pull: {photos: photo}}, {new: true});
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
            res.status(200).json(finalFile)
        } catch (e) {
            e.status = 401;
            next(e);
        }
    }
}


export default OrganisationsController;
