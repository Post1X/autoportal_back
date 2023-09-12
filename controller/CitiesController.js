import findCity from "../services/yndxsuggest";
class CitiesController {
    static findCity = async (req, res, next) => {
        try {
            const {city} = req.query;
            let id = 0;
            const response = await findCity(city);
            const cities = response.map((item) => {
                console.log(item.title.text)
                return {
                    id: id += 1,
                    city: item.title.text
                }
            })
            res.status(200).json(
                cities
            );
        } catch (e) {
            e.status = 401;
            next(e);
        }
    }
}
export default CitiesController;
