import mongoose from "mongoose";

const Schema = mongoose.Schema;

const OfertaSchema = new Schema({
    offer: {
        type: Schema.Types.String
    },
    policy: {
        type: Schema.Types.String
    }
})

const Oferta = mongoose.model('Oferta', OfertaSchema);

export default Oferta;
