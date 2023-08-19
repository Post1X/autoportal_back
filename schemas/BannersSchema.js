import mongoose from "mongoose";

const Schema = mongoose.Schema;

const BannersSchema = new Schema({
    organisation_id: {
        type: Schema.Types.ObjectId,
        ref: 'Organisations'
    },
    title: {
        type: Schema.Types.String
    },
    img: {
        type: Schema.Types.String
    },
    from: {
        type: Schema.Types.String
    },
    to: {
        type: Schema.Types.String
    },
    city: {
        type: Schema.Types.String
    }
})

const Banners = mongoose.model('Banners', BannersSchema);

export default Banners;
