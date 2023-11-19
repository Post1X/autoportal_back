import Reviews from "../schemas/ReviewsSchema";
import Dealers from "../schemas/DealersSchema";
import Organisations from "../schemas/OrganisationsSchema";

class ReviewsController {
    static createReview = async (req, res, next) => {
        try {
            const {user_id, isDealer, isGuest} = req;
            const {organizationId} = req.query;
            const {date, rating, comment} = req.body;
            const data = {};
            const client = await Dealers.findOne({
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
            const reviewToCheck = await Reviews.findOne({
                organisation_id: organizationId,
                user_id: user_id
            });
            if (!!reviewToCheck === true) {
                res.status(402).json({
                    error: 'Уже был отзыв.'
                })
            } else {
                const fullName = client && client.full_name ? client.full_name : (data && data.name ? data.name : 'Гость');
                const newReviews = new Reviews({
                    organisation_id: organizationId,
                    rating: rating,
                    comment: comment,
                    date: date,
                    fullName: fullName,
                    user_id: user_id
                })
                await newReviews.save();
                const reviews = await Reviews.find({
                    organisation_id: organizationId
                });
                const final_rating = reviews.map((item) => {
                    return Number(item.rating);
                });
                const sum = final_rating.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
                console.log(sum / reviews.length);
                await Organisations.updateOne({
                    _id: organizationId
                }, {
                    rating: Math.round(sum / reviews.length)
                });
                res.status(200).json({
                    message: 'success'
                })
            }
            res.status(300).json({
                error: 'Технические неполадки. Попробуйте позже.'
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
