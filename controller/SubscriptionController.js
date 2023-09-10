import Dealers from "../schemas/DealersSchema";

class SubscriptionController {
    static checkSub = async (req, res, next) => {
        try {
            const {user_id} = req;
            const dealer = await Dealers.findOne({
                _id: user_id
            });
            const subStatus = dealer.subscription_status;
            if (subStatus) {
                res.status(200).json({
                    isSubscribe: true
                })
            }
            //
            if (!subStatus) {
                res.status(200).json({
                    isSubscribe: false
                })
            }
        } catch (e) {
            e.status = 401;
            next(e);
        }
    }
    //
    static getSubMonth = async (req, res, next) => {
        try {
            const {user_id} = req;
            await Dealers.findOneAndUpdate({
                _id: user_id
            }, {
                subscription_status: true
            })
            res.status(200).json({
                message: 'ok'
            });
        } catch (e) {
            e.status = 401;
            next(e);
        }
    }
    //
    static getSubYear = async (req, res, next) => {
        try {
            const {user_id} = req;
            await Dealers.findOneAndUpdate({
                _id: user_id
            }, {
                subscription_status: true
            })
            res.status(200).json({
                message: 'ok'
            });
        } catch (e) {
            e.status = 401;
            next(e);
        }
    }
}

export default SubscriptionController;
