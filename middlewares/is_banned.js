import Dealers from "../schemas/DealersSchema";

const sub = async (req, res, next) => {
    try {
        const { user_id } = req;
        const dealer = await Dealers.findOne({
            _id: user_id
        });

        if (dealer && dealer.is_banned) {
            res.status(405).json({
                message: 'banned'
            });
        } else {
            next();
        }
    } catch (e) {
        console.error('Error in is_banned middleware:', e);
        e.status = 401;
        next(e);
    }
};

export default sub;
