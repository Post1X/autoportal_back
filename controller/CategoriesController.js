import Categories from "../schemas/CategoriesSchema";
import ExtServices from "../schemas/ExtServicesSchema";
import Services from "../schemas/ServicesSchema";
import Cars from "../schemas/CarsSchema";

class CategoriesController {
    static CreateCategory = async (req, res, next) => {
        try {
            const {title} = req.body;
            const destination = `${req.files[0].destination}${req.files[0].filename}`;
            const newCategory = new Categories({
                title: title,
                img: destination.split('public')[1]
            })
            await newCategory.save();
            res.status(200).json('ok')
        } catch (e) {
            e.status = 401;
            next(e);
        }
    }
    static GetCategories = async (req, res, next) => {
        try {
            const categories = await Categories.find();
            res.status(200).json(categories)
        } catch (e) {
            e.status = 401;
            next(e);
        }
    }
    //
    static FilterData = async (req, res, next) => {
        try {
            const { categoryId } = req.query;
            const services = await Services.find({
                category_id: categoryId
            });
            const ExtServicesPromise = services.map(async (item) => {
                const subServices = await ExtServices.find({
                    service_id: item._id
                });
                return {
                    item,
                    subServices
                };
            });
            const extservices = await Promise.all(ExtServicesPromise);
            const cars = await Cars.find();
            const typeService = services.map(service => ({
                _id: service._id,
                title: service.title,
                subServices: extservices.find(extservice => extservice.item._id.equals(service._id)).subServices
            }));
            const filteredObj = {
                typeService,
                brandCar: cars
            };
            res.status(200).json(filteredObj);
        } catch (e) {
            e.status = 401;
            next(e);
        }
    }
}

export default CategoriesController
