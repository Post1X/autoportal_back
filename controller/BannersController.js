import Banners from "../schemas/BannersSchema";

class BannersController {
    static CreateBanner = async (req, res, next) => {
        try {
            const {title, organisation_id, from, to, image} = req.body;
            const newBanner = new Banners({
                title: title,
                organisation_id: organisation_id,
                from: from,
                to: to,
                img: image
            })
            await newBanner.save();
            res.status(200).json({
                message: 'success'
            })
        } catch (e) {
            e.status = 401;
            next(e);
        }
    }
    static GetBanners = async (req, res, next) => {
        try {
            const {city} = req.query;
            if (city) {
                const banners = await Banners.find({
                    city: city
                });
                const image_array = [];
                banners.map((item) => {
                    image_array.push(item.img)
                })
                res.status(200).json(image_array)
            }
            if (!city) {
                const banners = await Banners.find({});
                const image_array = [];
                banners.map((item) => {
                    image_array.push(item.img)
                })
                res.status(200).json(image_array)
            }
        } catch (e) {
            e.status = 401;
            next(e);
        }
    }
}

export default BannersController;
