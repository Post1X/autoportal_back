import mongoose from "mongoose";

const Schema = mongoose.Schema;

const CarsSchema = new Schema({
    title: {
        type: Schema.Types.String
    },
    isPopular: {
        type: Schema.Types.Boolean,
        default: false
    }
})

const Cars = mongoose.model('Cars', CarsSchema);

export default Cars;
