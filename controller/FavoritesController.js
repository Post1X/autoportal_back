import Favorites from "../schemas/FavoritesSchema";

class FavoritesController {
    static AddOrganisationToFav = async (req, res, next) => {
        try {
            const {organisation} = req.query;
            const {user_id} = req;
            const newFavorite = new Favorites({
                client_id: user_id,
                organisation_id: organisation
            });
            await newFavorite.save();
            res.status(200).json({
                message: 'success'
            })
        } catch (e) {
            e.status = 401;
            next(e);
        }
    }
    //
    static DeleteFavOrganisation = async (req, res, next) => {
        try {
            const {organisation} = req.query;
            await Favorites.findOneAndDelete({
                organisation_id: organisation
            })
            res.status(200).json({
                message: 'success'
            })
        } catch (e) {
            e.status = 401;
            next(e);
        }
    }
    //
    static GetOrganisations = async (req, res, next) => {
        try {
            const {categoryId} = req.query;
            const {user_id} = req;
            const favList = await Favorites.find({
                client_id: user_id
            }).populate('organisation_id')
            if (!categoryId) {
                res.status(200).json(favList)
            }
            if (categoryId) {
                console.log('hi');
                const filteredList = favList.filter(item => item.organisation_id.category_id === categoryId);
                res.status(200).json({
                    filteredList
                })
            }
        } catch (e) {
            e.status = 401;
            next(e);
        }
    }
}

export default FavoritesController;
