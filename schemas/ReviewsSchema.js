import mongoose from "mongoose";

const Schema = mongoose.Schema;

const ReviewsSchema = new Schema({
    organisation_id: {
        type: Schema.Types.ObjectId,
        ref: 'Organisations'
    },
    rating: {
        type: Schema.Types.String
    },
    text: {
        type: Schema.Types.String
    }
})

const Reviews = mongoose.model('Reviews', ReviewsSchema);

export default Reviews;
