import Payments from "../schemas/PaymentsSchema";
import PaymentMethods from "../schemas/PaymentMethodsSchema";
import Subscription from "../schemas/SubscriptionSchema";
import Organisations from "../schemas/OrganisationsSchema";
import CheckPayment from "../utilities/CheckPayment";

class SubscriptionController {
    static checkSub = async (req, res, next) => {
        try {
            const {user_id} = req;
            const {organizationId} = req.query;
            const dealer = await Organisations.findOne({
                _id: organizationId
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
    static isReleased = async (req, res, next) => {
        try {
            res.status(200).json({
                isSubscribe: false
            })
        } catch (e) {
            e.status = 401;
            next(e);
        }
    }
    //
    static getInfo = async (req, res, next) => {
        try {
            const info = await Subscription.findOne();
            res.status(200).json(info)
        } catch (e) {
            e.status = 401;
            next(e);
        }
    }
    //
    static getSubMonth = async (req, res, next) => {
        try {
            const {organizationId} = req.query;
            const {user_id} = req;
            const organisation = await Organisations.findOne({
                _id: organizationId
            })
            const url = 'https://api.yookassa.ru/v3/payments';
            const payment_method_id = await PaymentMethods.findOne({
                user_id: user_id
            })
            const subDetails = await Subscription.findOne();
            if (organisation.subscription_status === true) {
                res.status(301).json({
                    error: 'У вас уже есть подписка'
                })
            }
            if (organisation.subscription_status === false) {
                function generateRandomString(length) {
                    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                    let randomString = '';
                    for (let i = 0; i < length; i++) {
                        const randomIndex = Math.floor(Math.random() * characters.length);
                        randomString += characters.charAt(randomIndex);
                    }
                    return randomString;
                }
                const authHeader = 'Basic ' + Buffer.from('244369:test_7NnPZ1y9-SJDn_kaPGbXe1He3EmNJP-RyUvKD_47y7w').toString('base64');
                const idempotenceKey = generateRandomString(7);
                const requestData = {
                    amount: {
                        value: subDetails.month_amount,
                        currency: 'RUB'
                    },
                    description: organizationId,
                    confirmation: {
                        type: 'redirect',
                        return_url: 'http://localhost:3001/orders/sas'
                    },
                    save_payment_method: true
                };
                fetch(url, {
                    method: 'POST',
                    headers: {
                        'Authorization': authHeader,
                        'Idempotence-Key': idempotenceKey,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(requestData)
                })
                    .then(response => response.json())
                    .then(async data => {
                        try {
                            if (!data.error) {
                                console.log(data);
                                await PaymentMethods.updateMany({
                                    user_id: user_id
                                }, {
                                    isNew: false
                                })
                                const newPaymentMethod = new PaymentMethods({
                                   user_id: user_id,
                                   payment_method_id: data.id,
                                    isNew: true
                                })
                                await newPaymentMethod.save();
                                res.status(200).json({
                                    data: data.confirmation.confirmation_url
                                })
                            } else {
                                res.status(400).json({
                                    message: 'Ошибка. Попробуйте снова.'
                                })
                            }
                        } catch (error) {
                            console.error('Error saving payment:', error);
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error);
                    });
            }
        } catch (e) {
            e.status = 401;
            next(e);
        }
    }
    //
    static getSubYear = async (req, res, next) => {
        try {
            const {organizationId} = req.query;
            const organisation = await Organisations.findOne({
                _id: organizationId
            })
            const url = 'https://api.yookassa.ru/v3/payments';
            const subDetails = await Subscription.findOne();
            if (organisation.subscription_status === true) {
                res.status(301).json({
                    error: 'У вас уже есть подписка'
                })
            }
            if (organisation.subscription_status === false) {
                function generateRandomString(length) {
                    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                    let randomString = '';
                    for (let i = 0; i < length; i++) {
                        const randomIndex = Math.floor(Math.random() * characters.length);
                        randomString += characters.charAt(randomIndex);
                    }
                    return randomString;
                }
                    const authHeader = 'Basic ' + Buffer.from('244369:test_7NnPZ1y9-SJDn_kaPGbXe1He3EmNJP-RyUvKD_47y7w').toString('base64');
                    const idempotenceKey = generateRandomString(7);
                    const requestData = {
                        amount: {
                            value: subDetails.year_amount,
                            currency: 'RUB'
                        },
                        description: organizationId,
                        confirmation: {
                            type: 'redirect',
                            return_url: 'http://localhost:3001/orders/sas'
                        },
                        save_payment_method: true
                    };
                    fetch(url, {
                        method: 'POST',
                        headers: {
                            'Authorization': authHeader,
                            'Idempotence-Key': idempotenceKey,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(requestData)
                    })
                        .then(response => response.json())
                        .then(async data => {
                            try {
                                if (!data.error) {
                                    res.status(200).json({
                                        data: data.confirmation.confirmation_url
                                    })
                                } else {
                                    res.status(400).json({
                                        message: 'Ошибка. Попробуйте снова.'
                                    })
                                }
                            } catch (error) {
                                console.error('Error saving payment:', error);
                            }
                        })
                        .catch(error => {
                            console.error('Error:', error);
                        });
            }
        } catch (e) {
            e.status = 401;
            next(e);
        }
    }
    //
    static getInfo = async (req, res, next) => {
        try {
            const subdetails = await Subscription.findOne({});
            res.status(200).json({
                subdetails
            })
        }catch (e) {
            e.status = 401;
            next(e);
        }
    }
    //
    static checkSubForOrg = async (req, res, next) => {
        try {
            const {organizationId} = req.query;
            const order_id = Payments.findOne({
                organizationId: organizationId
            })
            const paymentStatus = await CheckPayment(order_id.order_id);
            if (paymentStatus === 'succeeded')
            {
              await Organisations.findOneAndUpdate({
                  _id: organizationId
              }, {
                  status: 'active'
              });
            }else{
                res.status(300).json({
                    message: 'Подписка еще не куплена'
                })
            }
        }catch (e) {
            e.status = 401;
            next(e);
        }
    }
    static  changeStatus = async (req, res, next) => {
        try {
            const {organizationId, type} = req.query;
            const {user_id} = req;
            const payment = await PaymentMethods.findOne({
                user_id: user_id,
                isNew: true
            });
            if (payment)
            {
            await Payments.updateMany({
                seller_id: user_id,
                isNew: false
            })
            const newPayment = new Payments({
                seller_id: user_id,
                organizationId: organizationId,
                payment_method_id: payment.payment_method_id,
                type: type,
                isNew: true
            })
            const currentDate = new Date();
            const futureDate = new Date(currentDate);
            // if (type === 'month')
                futureDate.setMonth(currentDate.getMonth() + 1);
            if (type === 'year')
                futureDate.setMonth(currentDate.getMonth() + 12);
            const isoFormat = futureDate.toISOString();
            await Organisations.findOneAndUpdate({
                _id: organizationId
            }, {
                subscription_status: true,
                subscription_until: isoFormat,
                is_active: true
            });
            await newPayment.save()
            res.status(200).json({
                message: 'success'
            })
            }
        }catch (e) {
            e.status = 401;
            next(e);
        }
    }
    //
    static deactivateSubscription = async (req, res, next) =>
    {
        try
        {
            const {organizationId} = req.query;
            const {user_id} = req;
            // const organisation = await Organisations.findOne({
            //     _id: organizationId
            // });
            await Organisations.updateOne({
                _id: organizationId
            }, {
                // subscription_until: null
                is_active: false
            });
            await Payments.deleteMany({
                seller_id: user_id,
                organizationId: organizationId
            })
            res.status(200).json({
                message: 'success'
            })
        }
        catch (e)
        {
            e.status = 401;
            next(e);
        }
    }
    //
    static activateSubscription = async (req, res, next) => {
        try {
            const {organizationId} = req.query;
            const organisation = await Organisations.findOne({
                _id: organizationId
            });
            const currentDate = new Date();
            const futureDate = new Date(currentDate);
            const isoDate = futureDate.toISOString();
            if (isoDate >= organisation.subscription_until)
                res.status(301).json({
                    error: 'Купите подписку'
                })
            await Organisations.updateOne({
                _id: organizationId
            }, {
                is_active: true
            })
            res.status(200).json({
                message: 'success'
            })
        }catch (e) {
            e.status = 401;
            next(e);
        }
    }
}

export default SubscriptionController;
