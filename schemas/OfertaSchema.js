import mongoose from "mongoose";

const Schema = mongoose.Schema;

const OfertaSchema = new Schema({
    to: {
        type: Schema.Types.String
    },
    city: {
        type: Schema.Types.String
    }
})

const Oferta = mongoose.model('Oferta', OfertaSchema);

export default Oferta;
