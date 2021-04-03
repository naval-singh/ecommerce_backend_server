const Product = require("../models/product");
const Category = require("../models/category");

const createCategoryList = (categories, parentId = null) => {
    const categoryList = [];
    let category;
    if (parentId == null) {
        category = categories.filter((cat) => cat.parentId == undefined);
    } else {
        category = categories.filter((cat) => cat.parentId == parentId);
    }
    for (let cate of category) {
        categoryList.push({
            _id: cate._id,
            name: cate.name,
            slug: cate.slug,
            parentId: cate.parentId,
            type: cate.type,
            categoryPicture: cate.categoryPicture,
            children: createCategoryList(categories, cate._id),
        });
    }
    return categoryList;
};

exports.initialData = async (req, res) => {
    const categories = await Category.find({}).exec();
    const products = await Product.find({})
        .select("_id name price quantity productPictures description category createdBy")
        .populate({path: 'category', select: '_id name'})
        .populate({path: 'createdBy', select: '_id firstName lastName'})
        .exec();
    res.status(200).json({
        status: true,
        categories: createCategoryList(categories),
        products,
    });
};
