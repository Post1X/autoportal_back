import Payments from "../schemas/PaymentsSchema";
import Subscription from "../schemas/SubscriptionSchema";
import pay from "../utilities/pay";
import Organisations from "../schemas/OrganisationsSchema";

const sub = async (req, res, next) => {
    try {
        const {user_id} = req;

    } catch (e) {
        console.error('Error in is_banned middleware:', e);
        e.status = 401;
        next(e);
    }
};

export default sub;
