import Services from "../schemas/ServicesSchema";

class ServicesController {
    static CreateService = async (req, res, next) => {
        try {
            const {category_id, title} = req.body;
            const newService = new Services({
                category_id: category_id,
                title: title
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
                service_id: service_id,
                title: title,
                is_extended: true
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
            const {query} = req.query;
            const newRegExp = new RegExp(query, 'i');
            const services = await Services.find({
                title: newRegExp
            }).populate('category_id')
            res.status(200).json(
                services
            )
        } catch (e) {
            e.status = 401;
            next(e);
        }
    }
}

export default ServicesController;
