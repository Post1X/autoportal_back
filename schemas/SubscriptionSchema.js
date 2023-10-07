import mongoose from "mongoose";

const Schema = mongoose.Schema;

const SubscriptionSchema = new Schema({
    month_amount: {
        type: Schema.Types.Number
    },
    year_amount: {
        type: Schema.Types.Number
    },
    free_period: {
        type: Schema.Types.Number
    },
    percentage: {
        type: Schema.Types.Number
    }
});

const Subscription = mongoose.model('Subscription', SubscriptionSchema);

export default Subscription;
