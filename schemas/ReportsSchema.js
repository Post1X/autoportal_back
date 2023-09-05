import mongoose from "mongoose";

const Schema = mongoose.Schema;

const ReportsSchema = new Schema({
    organizationId: {
        type: Schema.Types.ObjectId,
        ref: 'Organisations'
    },
    comment: {
        type: Schema.Types.String
    }
})

const Reports = mongoose.model('Reports', ReportsSchema);

export default Reports;
