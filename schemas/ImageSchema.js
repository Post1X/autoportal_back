import mongoose from "mongoose";

const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: {
        type: Schema.Types.String
    }
})

const Images = mongoose.model('Images', ImageSchema);

export default Images;
