import Reviews from "../schemas/ReviewsSchema";
import Dealers from "../schemas/DealersSchema";
import Clients from "../schemas/ClientsSchema";

class ReviewsController {
    static createReview = async (req, res, next) => {
        try {
            const {user_id, isDealer, isGuest} = req;
            const {organizationId} = req.query;
            const {date, rating, comment} = req.body;
            const data = {};
            const client = await Clients.findOne({
                _id: user_id
            });
            if (isDealer === true) {
                const user = await Dealers.findOne({
                    _id: user_id
                });
                data.name = user.full_name;
            }
            if (isGuest === true) {
                res.status(400).json({
                    error: 'Не залогиненные пользователи не могут оставлять отзывы'
                })
            }
            const fullName = client && client.full_name ? client.full_name : (data && data.name ? data.name : 'Гость');
            const newReviews = new Reviews({
                organisation_id: organizationId,
                rating: rating,
                text: comment,
                date: date,
                fullName: fullName
            })
            await newReviews.save();
            res.status(200).json({
                message: 'success'
            })
        } catch (e) {
            e.status = 401;
            next(e);
        }
    }
    //
    static getReviews = async (req, res, next) => {
        try {
            const {organizationId} = req.query;
            const reviews = await Reviews.find({
                organisation_id: organizationId
            });
            res.status(200).json(reviews);
        } catch (e) {
            e.status = 401;
            next(e);
        }
    }
    //
    static updateReview = async (req, res, next) => {
        try {
            const {reviewId} = req.query;
            const {date, rating, comment} = req.body;
            await Reviews.findOneAndUpdate({
                _id: reviewId
            }, {
                date: date,
                rating: rating,
                comment: comment
            });
            res.status(200).json({
                message: 'success'
            })
        } catch (e) {
            e.status = 401;
            next(e);
        }
    }
}

export default ReviewsController;
