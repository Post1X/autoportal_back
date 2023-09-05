import Promotions from "../schemas/PromotionsSchema";

class PromotionsController {
    static CreatePromotion = async (req, res, next) => {
        try {
            const {description, startPromo, endPromo} = req.body;
            const {organizationId} = req.query;
            const from = date.from;
            const to = date.to;
            const newPromotion = new Promotions({
                organizationId: organizationId,
                description: description,
                startPromo: startPromo,
                endPromo: endPromo
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
        const {promotion_id} = req.query;
        await Promotions.findByIdAndDelete({
            _id: promotion_id
        })
        res.status(200).json({
            message: 'success'
        });
    };
    //
    static GetPromotions = async (req, res, next) => {
        const {organisation_id} = req.query;
        const promotions = await Promotions.find({
            organisation_id: organisation_id
        });
        res.status(200).json({
            promotions
        });
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
