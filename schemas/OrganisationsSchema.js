import mongoose from "mongoose";

const Schema = mongoose.Schema;

const OrganisationsSchema = new Schema({
    dealer_id: {
        type: Schema.Types.ObjectId,
        ref: 'Dealers'
    },
    categoryId: {
        type: Schema.Types.ObjectId,
        ref: 'Categories'
    },
    typeServices: [{
        type: Schema.Types.ObjectId,
        ref: 'Services'
    }],
    name: {
        type: Schema.Types.String
    },
    brandsCars: [{
        type: Schema.Types.ObjectId,
        ref: 'Cars'
    }],
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
    mainPhone: {
        type: Schema.Types.String
    },
    whatsApp: {
        type: Schema.Types.String
    },
    employeers: {
        type: Schema.Types.Array
    },
    description: {
        type: Schema.Types.String,
        maxLength: 255
    },
    schedule: {
        type: Schema.Types.Array
    },
    photos: {
        type: Schema.Types.Array
    },
    logo: {
        type: Schema.Types.Mixed
    },
    rating: {
        type: Schema.Types.Number,
        default: 0
    },
    is_banned: {
        type: Schema.Types.Boolean
    },
    subscription_status: {
        type: Schema.Types.Boolean,
        default: false
    },
    subscription_until: {
        type: Schema.Types.Date,
        default: null
    },
    free_period: {
        type: Schema.Types.Boolean,
        default: true
    },
    period_updated: {
        type: Schema.Types.Boolean,
        default: false
    },
    status: {
        type: Schema.Types.String
    }

})

const Organisations = mongoose.model('Organisations', OrganisationsSchema);

export default Organisations;
