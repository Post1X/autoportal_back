import Organisations from "../schemas/OrganisationsSchema";

class OrganisationsController {
    static CreateOrganisation = async (req, res, next) => {
        try {
            const {
                title,
                service_id,
                category_id,
                service_params,
                model_name,
                city,
                address,
                phone_number,
                wa_number,
                additional_phone,
                short_description,
                schedule
            } = req.body;
            const {user_id} = req;
            const photoArray = [];
            const logo_img = req.files.find(file => file.fieldname === 'logo_img');
            for (let i = 0; i < req.files.length - 1; i++) {
                const file = req.files[i];
                if (file.fieldname === `photo_${i}`) {
                    const logoFile = req.files.find(f => f.fieldname === `photo_${i}`);
                    const parts = logoFile.path.split('public');
                    const result = parts[1].substring(1);
                    photoArray.push(result);
                }
            }
            const address_name = address.address_name;
            const lon = address.lon;
            const lat = address.lat;
            const newOrganisation = new Organisations({
                dealer_id: user_id,
                title: title,
                service_id: service_id,
                extservices_id: service_params,
                category_id: category_id,
                model_name: model_name,
                city: city,
                address: address_name,
                lon: lon,
                lat: lat,
                phone_number: phone_number,
                wa_number: wa_number,
                additional_info: additional_phone,
                short_description: short_description,
                schedule: schedule,
                photo_array: photoArray,
                logo_img: logo_img
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
                .populate('category_id')
                .populate('service_id')
                .populate('extservices_id')
                .populate('model_names')
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
                title,
                service_id,
                category_id,
                service_params,
                model_name,
                city,
                address,
                phone_number,
                wa_number,
                additional_phone,
                short_description,
                schedule
            } = req.body;
            const {user_id} = req;
            const {organisation_id} = req.query;
            const photoArray = [];
            const logo_img = req.files.find(file => file.fieldname === 'logo_img');
            for (let i = 0; i < req.files.length - 1; i++) {
                const file = req.files[i];
                if (file.fieldname === `photo_${i}`) {
                    const logoFile = req.files.find(f => f.fieldname === `photo_${i}`);
                    const parts = logoFile.path.split('public');
                    const result = parts[1].substring(1);
                    photoArray.push(result);
                }
            }
            const address_name = address.address_name;
            const lon = address.lon;
            const lat = address.lat;
            await Organisations.findOneAndUpdate({
                _id: organisation_id
            }, {
                dealer_id: user_id,
                title: title,
                service_id: service_id,
                extservices_id: service_params,
                category_id: category_id,
                model_name: model_name,
                city: city,
                address: address_name,
                lon: lon,
                lat: lat,
                phone_number: phone_number,
                wa_number: wa_number,
                additional_info: additional_phone,
                short_description: short_description,
                schedule: schedule,
                photo_array: photoArray,
                logo_img: logo_img
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
            const {organisation_id} = req.query;
            const {user_id} = req;
            const organisation = await Organisations.findOne({
                _id: organisation_id, dealer_id: user_id
            })
                .populate('dealer_id')
                .populate('category_id')
                .populate('service_id')
                .populate('extservices_id')
                .populate('model_names')
            res.status(200).json({
                organisation
            })
        } catch (e) {
            e.status = 401;
            next(e);
        }
    }
    static FilterOrganisation = async (req, res, next) => {
        try {
            const {scheduleFilter, city, categoryId, servicesId, brandsCarsId, sortType} = req.body;
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
            console.log(query)
            for (const obj of query) {
                if (obj.schedule && Array.isArray(obj.schedule)) {
                    const days = obj.schedule.map(entry => entry.day);
                    days_ids.push({id: obj._id, days: days});
                }
            }
            const finalarray = [];
            await Promise.all(days_ids.map(async (item) => {
                if (scheduleFilter)
                    await Promise.all(scheduleFilter.map(async (day) => {
                        if (item.days.some(day => scheduleFilter.includes(day))) {
                            finalarray.push(item.id);
                        }
                    }));
            }));
            if (finalarray.length !== 0) {
                res.status(200).json(finalarray);
            }
            if (finalarray.length === 0) {
                res.status(200).json(query)
            }
        } catch (e) {
            e.status = 401;
            next(e);
        }
    }

}


export default OrganisationsController;
