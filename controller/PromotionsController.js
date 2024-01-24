import Promotions from "../schemas/PromotionsSchema";
import Organisations from "../schemas/OrganisationsSchema";

class PromotionsController {
    static CreatePromotion = async (req, res, next) => {
        try {
            const {description, startPromo, endPromo} = req.body;
            const {organizationId} = req.query;
            const organisation = await Organisations.findOne({
                _id: organizationId
            })
            const newPromotion = new Promotions({
                organizationId: organizationId,
                description: description,
                startPromo: startPromo,
                endPromo: endPromo,
                city: organisation.city,
                category_id: organisation.categoryId
            })
            await newPromotion.save();
            res.status(200).json({
                message: 'success'
            })
        } catch (e) {
            e.status = 401;
            next(e);
        }
    }
    //
    static DeletePromotion = async (req, res, next) => {
        try {
            const {promotion_id} = req.query;
            const deleted = await Promotions.findOneAndDelete({
                _id: promotion_id
            })
            res.status(200).json({
                deleted
            });
        } catch (e) {
            e.status = 401;
            next(e);
        }
    };
    //
    static GetPromotions = async (req, res, next) => {
        try {
            const {city, categoryId} = req.query;
            let filter = {};
            if (city)
                filter.city = city;
            if (categoryId)
                filter.category_id = categoryId;
            const promotion = await Promotions.find(filter);
            const arr = [];
            await Promise.all(promotion.map(async (item) => {
                const organisation = await Organisations.findOne({
                    _id: item.organizationId
                }).populate('categoryId')
                arr.push({
                    promotion: {
                        description: item.description,
                        startPromo: item.startPromo,
                        endPromo: item.endPromo
                    },
                    organization: {
                        _id: organisation ? organisation._id : null,
                        logo: organisation ? organisation.logo : null,
                        name: organisation ? organisation.name : null,
                        address: organisation ? organisation.address : null,
                        categoryName: organisation ? organisation.categoryId : null,
                        rating: organisation ? organisation.rating : null,
                        countReviews: 0
                    }
                })
            }))
            res.status(200).json(arr);
        } catch (e) {
            e.status = 401;
            next(e);
        }
    }


    //
    static updatePromotions = async (req, res, next) => {
        try {
            const {description, startPromo, endPromo} = req.body;
            const {organizationId} = req.query;
            await Promotions.findOneAndUpdate({
                organizationId: organizationId
            }, {
                description: description,
                startPromo: startPromo,
                endPromo: endPromo
            })
            res.status(200).json({
                message: 'success'
            })
        } catch (e) {
            e.status = 401;
            next(e);
        }
    }
}

export default PromotionsController;
