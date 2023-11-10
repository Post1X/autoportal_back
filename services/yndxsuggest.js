import fetch from "node-fetch"

export default async function findCity(text) {
    const url = `https://suggest-maps.yandex.ru/v1/suggest?apikey=20bca3d8-7d07-4e1f-8383-83efa72d1ee4&text=${text}&type=geo`
    try {
        const response = await fetch(url);
        const json = await response.json();
        return json.results.filter(result => result.tags.includes("locality"));
    } catch (error) {
        console.error(error);
        return 'error';
    }
}
