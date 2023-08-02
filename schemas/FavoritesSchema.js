import mongoose from "mongoose";

const Schema = mongoose.Schema;

const FavoritesSchema = new Schema({
    client_id: {
        type: Schema.Types.ObjectId,
        ref: 'Clients'
    },
    organisation_id: {
        type: Schema.Types.ObjectId,
        ref: 'Organisations'
    }
})

const Favorites = mongoose.model('Favorites', FavoritesSchema);

export default Favorites;
