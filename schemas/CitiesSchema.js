import mongoose from "mongoose";

const Schema = mongoose.Schema;

const CitiesSchema = new Schema({
    city_name: {
        type: Schema.Types.String
    },
    region_name: {
        type: Schema.Types.String
    },
    city_size: {
        type: Schema.Types.Number
    },
    full_name: {
        type: Schema.Types.String
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    }
})

CitiesSchema.index({location: "2dsphere"});
const Cities = mongoose.model('Cities', CitiesSchema);
export default Cities;
