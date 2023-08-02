import mongoose from "mongoose";

const Schema = mongoose.Schema;

const ExtServicesSchema = new Schema({
    title: {
        type: Schema.Types.String
    },
    service_id: {
        type: Schema.Types.ObjectId,
        ref: 'Services'
    }
})

const ExtServices = mongoose.model('ExtServices', ExtServicesSchema);

export default ExtServices;
