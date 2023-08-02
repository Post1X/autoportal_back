import mongoose from "mongoose";

const Schema = mongoose.Schema;

const PromotionsSchema = new Schema({
    organisation_id: {
        type: Schema.Types.ObjectId,
        ref: 'Organisations'
    },
    text: {
        type: Schema.Types.String
    },
    from: {
        type: Schema.Types.String
    },
    to: {
        type: Schema.Types.String
    }
})

const Promotions = mongoose.model('Promotions', PromotionsSchema);

export default Promotions;
