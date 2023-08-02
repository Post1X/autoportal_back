import mongoose from "mongoose";

const Schema = mongoose.Schema;

const OrganisationsSchema = new Schema({
    dealer_id: {
        type: Schema.Types.ObjectId,
        ref: 'Dealers'
    },
    category_id: {
        type: Schema.Types.ObjectId,
        ref: 'Categories'
    },
    service_id: {
        type: Schema.Types.ObjectId,
        ref: 'Services'
    },
    title: {
        type: Schema.Types.String
    },
    model_names: {
        type: Schema.Types.Array
    },
    city: {
        type: Schema.Types.String
    },
    address: {
        type: Schema.Types.String
    },
    lat: {
        type: Schema.Types.String
    },
    lon: {
        type: Schema.Types.String
    },
    phone_number: {
        type: Schema.Types.String
    },
    wa_number: {
        type: Schema.Types.String
    },
    additional_info: {
        type: Schema.Types.Array
    },
    short_description: {
        type: Schema.Types.String,
        maxLength: 255
    },
    schedule: {
        type: Schema.Types.Array
    },
    photo_array: {
        type: Schema.Types.Array
    },
    logo_img: {
        type: Schema.Types.String
    }
})

const Organisations = mongoose.model('Organisations', OrganisationsSchema);

export default Organisations;
