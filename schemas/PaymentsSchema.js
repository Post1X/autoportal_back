import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const PaymentsSchema = new Schema({
    seller_id: {
        type: Schema.Types.ObjectId,
        ref: 'Sellers'
    },
    organizationId: {
        type: Schema.Types.ObjectId,
        ref: 'Organisations'
    },
    payment_method_id: {
        type: Schema.Types.String
    },
    type: {
        type: Schema.Types.String
    }
})

const Payments = mongoose.model('Payments', PaymentsSchema);

export default Payments;
