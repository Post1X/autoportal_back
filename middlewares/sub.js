import Payments from "../schemas/PaymentsSchema";
import Subscription from "../schemas/SubscriptionSchema";
import pay from "../utilities/pay";
import Organisations from "../schemas/OrganisationsSchema";

const sub = async (req, res, next) => {
    try {
        const { user_id } = req;
        const payment = await Payments.findOne({
            seller_id: user_id,
            isNew: true,
            is_active: true
        });
        if (payment) {
            const organisation = await Organisations.findOne({
                _id: payment.organizationId
            });

            if (organisation) {
                const orgdate = organisation.subscription_until;
                const currentDate = new Date();

                if (currentDate.toISOString() !== orgdate) {
                    console.log('Subscription is active. Moving to the next middleware.');
                    next();
                } else {
                    console.log('Subscription is not active. Processing payment...');
                    let price = await Subscription.findOne();
                    if (payment.type === 'month') {
                        price = price.month_amount;
                    } else if (payment.type === 'year') {
                        price = price.year_amount;
                    }
                    await pay(price, payment, payment.payment_method_id, payment.organizationId);
                    console.log('Payment processed successfully. Moving to the next middleware.');
                    next();
                }
            } else {
                console.log('Organisation not found. Moving to the next middleware.');
                next();
            }
        } else {
            console.log('Payment not found. Moving to the next middleware.');
            next();
        }
    } catch (e) {
        console.error('Error in subscription middleware:', e);
        e.status = 401;
        next(e);
    }
};

export default sub;
