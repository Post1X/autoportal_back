import * as https from 'https';

// eslint-disable-next-line func-style,no-unused-vars,no-empty-function
export default async function makeCall(phoneNumber, code) {
    try {
        // console.log(code)
        // const postData = JSON.stringify({
        //     'recipient': phoneNumber,
        //     'type': 'sms',
        //     'payload': {
        //         'sender': 'sigmamessaging',
        //         'text': `Здравствуйте! Это автоматическая рассылка от Автопортала. Ваш код подтверждения: ${code}`
        //     }
        // });
        // const options = {
        //     hostname: 'online.sigmasms.ru',
        //     port: 443,
        //     path: '/api/sendings',
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'Authorization': '245943a96069469dd887aaadc56a11537aa6243238fff9608b10542214b15de9'
        //     }
        // };
        // const req = https.request(options, (res) => {
        //     let data = '';
        //     res.on('data', (chunk) => {
        //         data += chunk;
        //     });
        //
        //     res.on('end', () => {
        //         console.log(data);
        //     });
        // });
        // req.on('error', (error) => {
        //     console.error(error);
        // });
        // req.write(postData);
        // req.end();
        return 'ok';
    } catch (error) {
        console.error(error);
        return 'error';
    }
}
