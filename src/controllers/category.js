const slugify = require("slugify");
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
            categoryPicture: cate.categoryPicture,
            children: createCategoryList(categories, cate._id),
        });
    }
    return categoryList;
};

exports.addCategory = (req, res) => {
    const { name, parentId } = req.body;
    const categoryObj = {
        name,
        slug: slugify(name),
    };
    parentId && (categoryObj.parentId = parentId);
    req.file && (categoryObj.categoryPicture = req.file.filename)

    const _category = new Category(categoryObj);
    _category.save((error, category) => {
        if (error) {
            return res.status(200).json({ status: false, error });
        }
        if (category) {
            return res.status(200).json({ status: true, category });
        }
    });
};

exports.displayCategory = (req, res) => {
    Category.find({}).exec((error, categories) => {
        if (error) {
            return res.status(200).json({ status: false, error });
        }
        if (categories) {
            const categoryList = createCategoryList(categories);
            return res.status(200).json({ status: true, categoryList });
        }
    });
};
