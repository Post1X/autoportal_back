import mongoose from "mongoose";

const Schema = mongoose.Schema;

const CarsSchema = new Schema({
    model_name: {
        type: Schema.Types.String
    }
})

const Cars = mongoose.model('Cars', CarsSchema);

export default Cars;
