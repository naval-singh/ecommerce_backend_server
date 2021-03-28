const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true,
        },
        slug: {
            type: String,
            trim: true,
            unique: true,
        },
        type: {
            type: String,
        },
        categoryPicture: {
            type: String,
        },
        parentId: {
            type: String,
        },
    },
    { timestamps: true }
);

const Category = mongoose.model("Category", categorySchema);
module.exports = Category;
