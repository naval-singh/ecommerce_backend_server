const slugify = require("slugify");
const Category = require("../models/category");

createCategoryList = (categories, parentId = null) => {
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
    req.file && (categoryObj.categoryPicture = req.file.filename);

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

exports.updateCategories = async (req, res) => {
    const { _id, name, parentId, type } = req.body;
    if (name instanceof Array) {
        const updatedCategories = [];
        for (let i = 0; i < name.length; i++) {
            const category = {
                name: name[i],
                slug: slugify(name[i])
            };
            type[i] && (category.type = type[i]);
            parentId[i] ? category.parentId = parentId[i] : category.parentId = undefined;
            const updatedCategory = await Category.findOneAndUpdate({ _id: _id[i] }, category, { new: true });
            updatedCategories.push(updatedCategory);
        }
        return res.status(200).json({ status: true, updatedCategories });
    } else {
        const category = {
            name,
            slug: slugify(name)
        };
        type && (category.type = type);
        parentId ? category.parentId = parentId : category.parentId = undefined;
        const updatedCategory = await Category.findOneAndUpdate({ _id }, category, { new: true });
        return res.status(200).json({ status: true, updatedCategory });
    }
};
