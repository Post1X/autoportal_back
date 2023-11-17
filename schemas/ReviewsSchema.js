import mongoose from "mongoose";

const Schema = mongoose.Schema;

const ReviewsSchema = new Schema({
    organisation_id: {
        type: Schema.Types.ObjectId,
        ref: 'Organisations'
    },
    date: {
        type: Schema.Types.String
    },
    rating: {
        type: Schema.Types.String
    },
    comment: {
        type: Schema.Types.String
    },
    fullName: {
        type: Schema.Types.String
    },
    user_id: {
        type: Schema.Types.ObjectId
    }
})

const Reviews = mongoose.model('Reviews', ReviewsSchema);

export default Reviews;
