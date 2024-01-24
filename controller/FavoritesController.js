import Favorites from "../schemas/FavoritesSchema";
import Organisations from "../schemas/OrganisationsSchema";

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
    static getAllFavorites = async (req, res, next) => {
        try {
            const {user_id} = req;
            const favorites = await Favorites.find({
                client_id: user_id
            });
            res.status(200).json(favorites);
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
                const favListWithCount = [];
                for (const fav of favList) {
                    const count = await Favorites.count({organisation_id: fav.organisation_id});
                    const org = await Organisations.findById(fav.organisation_id._id).populate('categoryId')
                    if (org) {
                        const {_id, logo, name, address, city, rating, categoryId} = org;
                        const organisationDTO = {
                            _id: _id.toString(),
                            logo: logo || '',
                            name: name || '',
                            address: address || '',
                            categoryName: categoryId,
                            rating: rating || null,
                            countReviews: count || null
                        };
                        favListWithCount.push({
                            _id: fav._id.toString(),
                            client_id: fav.client_id.toString(),
                            organisation_id: organisationDTO
                        });
                    }
                }
                res.status(200).json(favListWithCount);
            }
            if (categoryId) {
                const filteredList = favList.filter(item => item.organisation_id.categoryId.toString() === categoryId.toString());
                const countReviewsPromises = filteredList.map(async (item) => {
                    const count = await Favorites.count({organisation_id: item.organisation_id._id});
                    const org = await Organisations.findById(item.organisation_id._id).populate('categoryId')
                    if (org) {
                        const {_id, logo, name, address, city, rating, categoryId} = org;
                        const organisationDTO = {
                            _id: _id.toString(),
                            logo: logo || '',
                            name: name || '',
                            address: address || '',
                            categoryName: categoryId,
                            rating: rating || null,
                            countReviews: count || null
                        };
                        return {
                            client_id: item.client_id,
                            _id: item._id,
                            organisation_id: organisationDTO
                        };
                    }
                });
                const organizationsWithReviews = await Promise.all(countReviewsPromises);
                const filteredOrganizationsWithReviews = organizationsWithReviews.filter(org => org);
                res.status(200).json(filteredOrganizationsWithReviews);
            }
        } catch (e) {
            e.status = 401;
            next(e);
        }
    }
}

export default FavoritesController;
