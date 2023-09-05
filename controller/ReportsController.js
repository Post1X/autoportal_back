import Reports from "../schemas/ReportsSchema";

class ReportsController {
    static createReport = async (req, res, next) => {
        try {
            const {organizationId} = req.query;
            const {comment} = req.body;
            const newReport = new Reports({
                organizationId: organizationId,
                comment: comment
            });
            await newReport.save();
            res.status(200).json({
                message: 'success'
            })
        } catch (e) {
            e.status = 401;
            next(e);
        }
    }
}

export default ReportsController;
