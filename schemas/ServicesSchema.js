import mongoose from "mongoose";

const Schema = mongoose.Schema;

const ServicesSchema = new Schema({
    category_id: {
        type: Schema.Types.ObjectId,
        ref: 'Categories'
    },
    title: {
        type: Schema.Types.String
    }
})

const Services = mongoose.model('Services', ServicesSchema);

export default Services;
