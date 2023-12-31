import Services from "../schemas/ServicesSchema";

class ServicesController {
    static CreateService = async (req, res, next) => {
        try {
            const {category_id, title} = req.body;
            const newService = new Services({
                category_id: category_id, title: title
            })
            await newService.save();
            res.status(200).json('ok')
        } catch (e) {
            e.status = 401;
            next(e);
        }
    }
    static CreateExtService = async (req, res, next) => {
        try {
            const {service_id, title} = req.body;
            const newExtService = new Services({
                service_id: service_id, title: title, is_extended: true
            })
            await newExtService.save();
            res.status(200).json('ok')
        } catch (e) {
            e.status = 401;
            next(e);
        }
    }
    //
    static GetServices = async (req, res, next) => {
        try {
            const {query, category_id} = req.query;
            const newRegExp = new RegExp(query, 'i');
            const services = await Services.find({
                title: newRegExp, category_id: category_id
            }).populate('category_id')
            res.status(200).json(services)
        } catch (e) {
            e.status = 401;
            next(e);
        }
    }
    //
    static deleteSerivce = async (req, res, next) => {
        try {
            const {serviceId} = req.query;
            await Services.deleteOne({
                _id: serviceId
            })
            await Services.deleteMany({
                service_id: serviceId
            })
            res.status(200).json({
                message: 'success'
            })
        } catch (e) {
            e.status = 401;
            next(e);
        }
    }
    static updateService = async (req, res, next) => {
        try {
            const {serviceId} = req.query;
            const {title} = req.body;
            await Services.updateOne({
                _id: serviceId
            }, {
                title: title
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
    static getExtServices = async (req, res, next) => {
        try {
            const {serviceId} = req.query;
            const extservice = await Services.find({
                service_id: serviceId
            })
            res.status(200).json({
                extservice
            })
        } catch (e) {
            e.status = 401;
            next(e);
        }
    }
    //
    static searchServices = async (req, res, next) => {
        try {
            const {query} = req.query;
            const newRegExp = new RegExp(query, 'i');
            const services = await Services.find({
                title: newRegExp,
            }).populate('category_id');

            const arr_to_return = await Promise.all(services.map(async (item) => {
                let categoryId = null;

                if (item.is_extended === true) {
                    const extendedService = await Services.findOne({
                        _id: item.service_id,
                    }).populate('category_id');

                    if (extendedService && extendedService.category_id) {
                        categoryId = extendedService.category_id._id;
                    }
                } else {
                    categoryId = item.category_id ? item.category_id._id : null;
                }

                return {
                    title: item.title, is_extended: item.is_extended, categoryId: categoryId, service_id: item._id,
                };
            }));

            res.status(200).json(arr_to_return);
        } catch (e) {
            e.status = 401;
            next(e);
        }
    }
}

export default ServicesController;
