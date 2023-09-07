import mongoose from "mongoose";

const Schema = mongoose.Schema;

const PromotionsSchema = new Schema({
    organizationId: {
        type: Schema.Types.ObjectId,
        ref: 'Organisations'
    },
    description: {
        type: Schema.Types.String
    },
    startPromo: {
        type: Schema.Types.String
    },
    endPromo: {
        type: Schema.Types.String
    },
    city: {
        type: Schema.Types.String
    },
    category_id: {
        type: Schema.Types.ObjectId,
        ref: 'Categories'
    }
})

const Promotions = mongoose.model('Promotions', PromotionsSchema);

export default Promotions;
