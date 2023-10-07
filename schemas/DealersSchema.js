import mongoose from "mongoose";

const Schema = mongoose.Schema;

const DealersSchema = new Schema({
    full_name: {
        type: Schema.Types.String
    },
    phone_number: {
        type: Schema.Types.String
    },
    city: {
        type: Schema.Types.String
    },
    email: {
        type: Schema.Types.String
    },
    password: {
        type: Schema.Types.String
    },
    code: {
        type: Schema.Types.String
    },
    subscription_status: {
        type: Schema.Types.Boolean,
        default: false
    },
    is_banned: {
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
    }
})

const Dealers = mongoose.model('Dealers', DealersSchema);

export default Dealers;
