import Organisations from "../schemas/OrganisationsSchema";
import moment from "moment-timezone";
import Reviews from "../schemas/ReviewsSchema";

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
                schedule
            } = req.body;
            const {user_id} = req;
            const photoArray = [];
            let finalLogo;
            if (req.files) {
                const logo_img = req.files.find(file => file.fieldname === 'logo_img');
                const parts = logo_img.path.split('public');
                finalLogo = `http://194.67.125.33:3001/${parts[1].substring(1)}`
                for (let i = 0; i < req.files.length - 1; i++) {
                    const file = req.files[i];
                    if (file.fieldname === `photo_${i}`) {
                        const logoFile = req.files.find(f => f.fieldname === `photo_${i}`);
                        const parts = logoFile.path.split('public');
                        const result = `http://194.67.125.33:3001/${parts[1].substring(1)}`;
                        photoArray.push(result);
                    }
                }
            }
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
                photos: photoArray,
                logo: finalLogo
            })
            await newOrganisation.save();
            res.status(200).json({
                message: 'success'
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
            res.status(200).json(organisations);
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
                schedule
            } = req.body;
            const {user_id} = req;
            const {organisation_id} = req.query;
            const photoArray = [];
            let finalLogo;
            if (req.files) {
                const logo_img = req.files.find(file => file.fieldname === 'logo_img');
                const parts = logo_img.path.split('public');
                finalLogo = `http://194.67.125.33:3001/${parts[1].substring(1)}`
                for (let i = 0; i < req.files.length - 1; i++) {
                    const file = req.files[i];
                    if (file.fieldname === `photo_${i}`) {
                        const logoFile = req.files.find(f => f.fieldname === `photo_${i}`);
                        const parts = logoFile.path.split('public');
                        const result = `http://194.67.125.33:3001/${parts[1].substring(1)}`;
                        photoArray.push(result);
                    }
                }
            }
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
                // lon: lon,
                // lat: lat,
                mainPhone: mainPhone,
                whatsApp: whatsApp,
                employeers: employeers,
                description: description,
                schedule: schedule,
                photos: photoArray,
                logo: finalLogo
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
            const reviews = await Reviews.find({
                organisation_id: id
            });
            const final_rating = reviews.map((item) => {
                return Number(item.rating);
            });
            const sum = final_rating.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
            const rating = Math.round(sum / final_rating.length);

            const organisation = await Organisations.findOne({
                _id: id
            })
                .populate('dealer_id')
                .populate('categoryId')
                .populate('typeServices')
                .populate('brandsCars')
            res.status(200).json({
                organisation,
                rating: rating
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
            const {scheduleFilter, city, categoryId, servicesId, brandsCarsId, sortType, id} = req.body;
            const filter = {};
            if (city) {
                filter.city = city;
            }
            if (categoryId) {
                filter.category_id = categoryId;
                console.log(categoryId)
            }
            if (servicesId) {
                filter.service_id = servicesId
            }
            if (brandsCarsId) {
                filter.model_names = brandsCarsId;
            }
            const days_ids = [];
            const query = await Organisations.find(filter);
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
                                }).populate('dealer_id')
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
                                }).populate('dealer_id')
                                    .populate('categoryId')
                                    .populate('typeServices')
                                    .populate('brandsCars'));
                            }
                        }
                    }

                    if (scheduleFilter.isAllDay && !scheduleFilter.Days) {
                        const days = item.days;
                        const todayObj = item.days.filter(day => day.all_day === true);
                        console.log(todayDay)
                        console.log(todayObj)
                        console.log(todayObj.some(day => day === todayDay))
                        if (todayObj.some(dayObj => dayObj.day === todayDay)) {
                            for (const dayItem of days) {
                                final_array.push(await Organisations.find({
                                    _id: item.id,
                                    filter
                                }).populate('dealer_id')
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
                                }).populate('dealer_id')
                                    .populate('categoryId')
                                    .populate('typeServices')
                                    .populate('brandsCars'))
                            }
                        }
                    }
                }));
                const modifiedOrganisations = await Promise.all(final_array.map(async (item) => {
                    console.log(item)
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
                        rating: rating
                    };
                }));
                res.status(200).json(modifiedOrganisations);
            }
            if (!scheduleFilter) {
                final_array.push(...await Organisations.find(
                    filter
                ).populate('dealer_id')
                    .populate('categoryId')
                    .populate('typeServices')
                    .populate('brandsCars'));
                const modifiedOrganisations = await Promise.all(final_array.map(async (item) => {
                    console.log(item)
                    const reviews = await Reviews.find({
                        organisation_id: item._id
                    });
                    const final_rating = reviews.map((item) => {
                        return Number(item.rating);
                    });
                    const sum = final_rating.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
                    const rating = Math.round(sum / final_rating.length);
                    return {
                        ...item.toObject(),
                        rating: rating
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
}


export default OrganisationsController;


// 64f5b47e95355c13fc430235 category
//  64f5b50dedf61fbf3f020a29 64f5b516edf61fbf3f020a2a service1

// 64f5b4d595355c13fc430237  64f5b77dedf61fbf3f020a2e service 2
