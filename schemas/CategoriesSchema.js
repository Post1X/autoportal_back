import mongoose from "mongoose";

const Schema = mongoose.Schema;

const CategoriesSchema = new Schema({
    title: {
        type: Schema.Types.String
    }
})

const Categories = mongoose.model('Categories', CategoriesSchema);

export default Categories;
