import mongoose from "mongoose";

const Schema = mongoose.Schema;

const ServicesSchema = new Schema({
    title: {
        type: Schema.Types.String
    },
    category_id: {
        type: Schema.Types.ObjectId,
        ref: 'Categories'
    },
    service_id: {
        type: Schema.Types.ObjectId,
        ref: 'Services'
    },
    is_extended: {
        type: Schema.Types.Boolean,
        default: false
    }
})

const Services = mongoose.model('Services', ServicesSchema);

export default Services;
