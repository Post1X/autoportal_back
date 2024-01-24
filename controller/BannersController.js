import Banners from "../schemas/BannersSchema";

class BannersController {
    static CreateBanner = async (req, res, next) => {
        try {
            const {title, organisation_id, from, to, image, city} = req.body;
            const newBanner = new Banners({
                title: title,
                organisation_id: organisation_id,
                from: from,
                to: to,
                img: image,
                city: city
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
    static deleteBanner = async (req, res, next) => {
        try {
            const {bannerId} = req.query;
            await Banners.deleteOne({
                _id: bannerId
            });
            res.status(200).json({
                message: 'success'
            })
        }catch (e) {
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
                    image_array.push({
                        _id: item._id,
                        organizationId: item.organisation_id,
                        title: item.title,
                        image: item.img,
                        from: item.from,
                        to: item.to
                    })
                })
                res.status(200).json(image_array)
            }
            if (!city) {
                const banners = await Banners.find({});
                const image_array = [];
                banners.map((item) => {
                    image_array.push({
                        _id: item._id,
                        organizationId: item.organisation_id,
                        title: item.title,
                        image: item.img,
                        from: item.from,
                        to: item.to
                    })
                })
                res.status(200).json(image_array)
            }
        } catch (e) {
            e.status = 401;
            next(e);
        }
    }
    //
    static updateBanner = async (req, res, next) => {
        try {
            const {bannerId} = req.query;
            const {title, from, to, image, city} = req.body;
            await Banners.updateOne({
                _id: bannerId
            },
                {
                    title: title,
                    from: from,
                    to: to,
                    img: image,
                    city: city
                })
            res.status(200).json({
                message: 'success'
            })
        }catch (e) {
            e.status = 401;
            next(e);
        }
    }
}

export default BannersController;
