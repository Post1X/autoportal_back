import Payments from "../schemas/PaymentsSchema";
import Organisations from "../schemas/OrganisationsSchema";
import Subscription from "../schemas/SubscriptionSchema";
import pay from "../utilities/pay";

const sub = async (req, res, next) => {
    try {
        const { user_id } = req;
        const payment = await Payments.findOne({
            seller_id: user_id
        });
        if (payment)
        {
            const organisation = await Organisations.findOne({
                _id: payment.organizationId
            });
            if (organisation)
            {
                const orgdate = organisation.subscription_until;
                const currentDate = new Date();
                if (currentDate.toISOString() !== orgdate)
                    next();
                if (currentDate.toISOString() === orgdate)
                {
                    let price = await Subscription.findOne();
                    if (payment.type === 'month')
                        price = price.month_amount;
                    if (payment.type === 'year')
                        price = price.year_amount;
                    await pay(price, payment, payment.payment_method_id, payment.organizationId);
                    next();
                }
                else
                    next();
            }
            else
                next();
        }
        else
            next();
    }
    catch (e)
    {
        e.status = 401;
        next(e);
    }
}

export default sub;
