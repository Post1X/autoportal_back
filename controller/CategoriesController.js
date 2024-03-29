import Categories from "../schemas/CategoriesSchema";
import Services from "../schemas/ServicesSchema";
import Cars from "../schemas/CarsSchema";

class CategoriesController {
    static CreateCategory = async (req, res, next) => {
        try {
            const {title, noService, titleTypeService, noBrands} = req.body;
            console.log(req)
            const destination = `${req.files[0].destination}${req.files[0].filename}`;
            const finalDest = `http://194.67.125.33:3001/${destination.split('public')[1]}`
            const newCategory = new Categories({
                title: title,
                img: finalDest,
                titleTypeService: titleTypeService,
                noBrands: noBrands,
                noService: noService
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
    };
    //
    static FilterData = async (req, res, next) => {
        try {
            const {categoryId} = req.query;
            const services = await Services.find({
                category_id: categoryId
            });
            const titleTypeService = await Categories.findOne({
                _id: categoryId
            })
            const ExtServicesPromise = services.map(async (item) => {
                const subServices = await Services.find({
                    service_id: item._id
                });
                return {
                    item,
                    subServices,

                };
            });
            const extservices = await Promise.all(ExtServicesPromise);
            const cars = await Cars.find().sort({isPopular: -1});
            const typeService = services.map(service => ({
                _id: service._id,
                title: service.title,
                subServices: extservices.find(extservice => extservice.item._id.equals(service._id)).subServices
            }));
            const filteredObj = {
                typeService,
                brandCar: titleTypeService.noCars ? null : cars,
                titleTypeService: titleTypeService.titleTypeService ? titleTypeService.titleTypeService : null,
            };
            res.status(200).json(filteredObj);
        } catch (e) {
            e.status = 401;
            next(e);
        }
    }
    //
    static deleteCategory = async (req, res, next) => {
        try {
            const {categoryId} = req.query;
            await Categories.deleteOne({
                _id: categoryId
            });
            res.status(200).json({
                message: 'success'
            })
        } catch (e) {
            e.status = 401;
            next(e);
        }
    }
}

export default CategoriesController
