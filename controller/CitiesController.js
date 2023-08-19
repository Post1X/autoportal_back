import Cities from "../schemas/CitiesSchema";

class CitiesController {
    static FindCity = async (req, res, next) => {
        try {
            const {search} = req.query;
            const regex = new RegExp("^" + search, 'i');
            const cities = await Cities.find({CityName: regex})
                .select('CityName')
                .select('RegionName')
                .select('CitySize')
                .select('Longitude')
                .select('Latitude')
                .limit(20)
            if (!search) {
                const cities = await Cities.find();
                res.status(200).json(cities)
            }
            res.status(200).json(cities)

        } catch (e) {
            e.status = 401;
            next(e);
        }
    }
    //
    static FindRadius = async (req, res, next) => {
        try {
            const {city} = req.query;
            const maxDistance = 20000;
            const fCity = await Cities.findOne({
                city_name: city
            });

            if (fCity.length === 0) {
                res.status(404).json({
                    status: "error",
                    message: "Город не найден."
                });
                return;
            }
            const nearest = await Cities.aggregate([
                {
                    $geoNear: {
                        near: {
                            type: "Point",
                            coordinates: fCity.location.coordinates
                        },
                        distanceField: "dist.calculated",
                        spherical: true
                    }
                },
                {
                    $match: {
                        "dist.calculated": { $lte: 20000 }
                    }
                }
            ]);
            res.status(200).json({
                nearest
            });
        } catch (e) {
            e.status = 401;
            next(e);
        }
    }
}

export default CitiesController;
