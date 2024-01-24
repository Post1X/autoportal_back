import mongoose from "mongoose";

const Schema = mongoose.Schema;

const CategoriesSchema = new Schema({
    title: {
        type: Schema.Types.String
    },
    img: {
        type: Schema.Types.String
    },
    titleTypeService: {
        type: Schema.Types.String
    },
    noBrands: {
        type: Schema.Types.Boolean
    },
    noService: {
        type: Schema.Types.Boolean
    }
})

const Categories = mongoose.model('Categories', CategoriesSchema);

export default Categories;
