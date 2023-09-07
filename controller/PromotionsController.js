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
            await Promotions.findByIdAndDelete({
                _id: promotion_id
            })
            res.status(200).json({
                message: 'success'
            });
        } catch (e) {
            e.status = 401;
            next(e);
        }
    };
    //
    static GetPromotions = async (req, res, next) => {
        try {
            const {organisation_id} = req.query;
            const promotions = await Promotions.find({
                organisation_id: organisation_id
            });

            res.status(200).json({
                promotions
            });
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
            await Promotions.findByIdAndUpdate({
                organizationId: organizationId
            }, {
                description: description,
                startPromo: startPromo,
                endPromo: endPromo
            })
        } catch (e) {
            e.status = 401;
            next(e);
        }
    }
}

export default PromotionsController;
