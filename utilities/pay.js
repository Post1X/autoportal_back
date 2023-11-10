import Organisations from "../schemas/OrganisationsSchema";

export default async function pay(price, payment_method_id, type, organizationId) {
    const url = 'https://api.yookassa.ru/v3/payments';
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
            value: price,
            currency: 'RUB'
        },
        capture: true,
        description: "Э",
        confirmation: {
            type: 'redirect',
            return_url: 'http://localhost:3001/orders/sas'
        },
        payment_method_id: payment_method_id
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
        .then(async (data) => {
            return !data.error;
            })
    const currentDate = new Date();
    const futureDate = new Date(currentDate);
    if (type === 'month')
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
}
