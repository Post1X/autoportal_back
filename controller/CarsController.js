import Cars from "../schemas/CarsSchema";

class CarsController {
    static CreateModel = async (req, res, next) => {
        try {
            const {model} = req.body;
            const newCar = new Cars({
                model_name: model
            });
            await newCar.save();
            res.status(200).json({
                message: 'ok'
            })
        } catch (e) {
            e.status = 401;
            next(e);
        }
    }
    //
    static GetCars = async (req, res, next) => {
        try {
            const cars = await Cars.find();
            res.status(200).json(cars)
        } catch (e) {
            e.status = 401;
            next(e);
        }
    }
}

export default CarsController;
