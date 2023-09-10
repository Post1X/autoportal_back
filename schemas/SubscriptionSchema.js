import mongoose from "mongoose";

const Schema = mongoose.Schema;

const SubscriptionSchema = new Schema({
    amount: {
        type: Schema.Types.Number
    },
    free_period: {
        type: Schema.Types.Number
    }
});

const Subscription = mongoose.model('Subscription', SubscriptionSchema);

export default Subscription;
