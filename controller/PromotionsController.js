import Promotions from "../schemas/PromotionsSchema";

class PromotionsController {
    static CreatePromotion = async (req, res, next) => {
        try {
            const {promotion, date} = req.body;
            const {organisation_id} = req.query;
            const from = date.from;
            const to = date.to;
            const newPromotion = new Promotions({
                organisation_id: organisation_id,
                text: promotion,
                from: from,
                to: to
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
    static GetPromotion = async (req, res, next) => {
        const {promotion_id} = req.query;
        const promotion = await Promotions.findOne({
            _id: promotion_id
        });
    }
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

}

export default PromotionsController;
