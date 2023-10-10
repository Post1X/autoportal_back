import Payments from "../schemas/PaymentsSchema";
import PaymentMethods from "../schemas/PaymentMethodsSchema";
import Subscription from "../schemas/SubscriptionSchema";
import Organisations from "../schemas/OrganisationsSchema";

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

                if (payment_method_id) {
                    const authHeader = 'Basic ' + Buffer.from('244369:test_7NnPZ1y9-SJDn_kaPGbXe1He3EmNJP-RyUvKD_47y7w').toString('base64');
                    const idempotenceKey = generateRandomString(7);
                    const requestData = {
                        amount: {
                            value: subDetails.month_amount,
                            currency: 'RUB'
                        },
                        capture: true,
                        description: organizationId,
                        payment_method_id: payment_method_id.payment_method_id
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
                                const newPayment = new Payments({
                                    seller_id: user_id,
                                    order_id: data.id,
                                    forSub: true,
                                    forMonth: true,
                                    organizationId: organizationId
                                });
                                await newPayment.save();
                                const filter = {_id: newPayment.id};
                                await Payments.updateMany({_id: {$ne: filter}}, {
                                    forSub: false,
                                    forMonth: false
                                });
                                res.status(200).json({
                                    message: 'success'
                                })
                            } catch (error) {
                                console.error('Error saving payment:', error);
                            }
                        })
                        .catch(error => {
                            console.error('Error:', error);
                        });
                }
                if (!payment_method_id) {
                    const authHeader = 'Basic ' + Buffer.from('244369:test_7NnPZ1y9-SJDn_kaPGbXe1He3EmNJP-RyUvKD_47y7w').toString('base64');
                    const idempotenceKey = generateRandomString(7);
                    const requestData = {
                        amount: {
                            value: subDetails.month_amount,
                            currency: 'RUB'
                        },
                        capture: true,
                        confirmation: {
                            type: 'redirect',
                            return_url: 'http://localhost:3001/orders/'
                        },
                        description: organizationId,
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
                            const newPayment = new Payments({
                                seller_id: user_id,
                                order_id: data.id,
                                forSub: true,
                                forMonth: true,
                                organizationId: organizationId
                            });
                            const newPaymentMethod = new PaymentMethods({
                                payment_method_id: data.id,
                                user_id: user_id
                            })
                            try {
                                await newPaymentMethod.save();
                                await newPayment.save();
                                const filter = {_id: newPayment.id};
                                await Payments.updateMany({_id: {$ne: filter}}, {
                                    forSub: false
                                });
                                res.status(200).json({
                                    data: data.confirmation.confirmation_url,
                                });
                            } catch (error) {
                                console.error('Error saving payment:', error);
                                res.status(500).json({error: 'Failed to save payment data'});
                            }
                        })
                        .catch(error => {
                            console.error('Error:', error);
                        });
                }
            }
        } catch (e) {
            e.status = 401;
            next(e);
        }
    }
    //
    static getSubYear = async (req, res, next) => {
        try {
            const organisation = await Organisations.findOne({
                _id: organizationId
            })
            const {user_id} = req;
            const {organizationId} = req.query;
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

                if (payment_method_id) {
                    const authHeader = 'Basic ' + Buffer.from('244369:test_7NnPZ1y9-SJDn_kaPGbXe1He3EmNJP-RyUvKD_47y7w').toString('base64');
                    const idempotenceKey = generateRandomString(7);
                    const requestData = {
                        amount: {
                            value: subDetails.year_amount,
                            currency: 'RUB'
                        },
                        capture: true,
                        description: organizationId,
                        payment_method_id: payment_method_id.payment_method_id
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
                                    const newPayment = new Payments({
                                        seller_id: user_id,
                                        order_id: data.id,
                                        forSub: true,
                                        forYear: true,
                                        organizationId: organizationId
                                    });
                                    await newPayment.save();
                                    const filter = {_id: newPayment.id};
                                    await Payments.updateMany({_id: {$ne: filter}}, {
                                        forSub: false,
                                        forYear: false
                                    });
                                    res.status(200).json({
                                        message: 'success'
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
                if (!payment_method_id) {
                    const authHeader = 'Basic ' + Buffer.from('244369:test_7NnPZ1y9-SJDn_kaPGbXe1He3EmNJP-RyUvKD_47y7w').toString('base64');
                    const idempotenceKey = generateRandomString(7);
                    const requestData = {
                        amount: {
                            value: subDetails.year_amount,
                            currency: 'RUB'
                        },
                        capture: true,
                        confirmation: {
                            type: 'redirect',
                            return_url: 'http://localhost:3001/orders/'
                        },
                        description: organizationId,
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
                            const newPayment = new Payments({
                                seller_id: user_id,
                                order_id: data.id,
                                forSub: true,
                                forYear: true,
                                organizationId: organizationId
                            });
                            const newPaymentMethod = new PaymentMethods({
                                payment_method_id: data.id,
                                user_id: user_id
                            })
                            try {
                                await newPaymentMethod.save();
                                await newPayment.save();
                                const filter = {_id: newPayment.id};
                                await Payments.updateMany({_id: {$ne: filter}}, {
                                    forSub: false
                                });
                                res.status(200).json({
                                    data: data.confirmation.confirmation_url,
                                });
                            } catch (error) {
                                console.error('Error saving payment:', error);
                                res.status(500).json({error: 'Failed to save payment data'});
                            }
                        })
                        .catch(error => {
                            console.error('Error:', error);
                        });
                }
            }
        } catch (e) {
            e.status = 401;
            next(e);
        }
    }
    //
    static checkPayment = async (req, res, next) => {
        try {
            // const payment = await CheckPayment('2cab6c5c-000f-5000-9000-1097a297a9a1');
            res.status(200).json({
                gay: 'gay'
            })
        } catch (e) {
            e.status = 401;
            next(e);
        }
    }
}

export default SubscriptionController;
