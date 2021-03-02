const slugify = require("slugify");
const Category = require("../models/category");

exports.addCategory = (req, res) => {
    const { name, parentId } = req.body;
    const categoryObj = {
        name,
        slug: slugify(name),
    };
    parentId && (categoryObj.parentId = parentId);

    const _category = new Category(categoryObj);
    _category.save((error, category) => {
        if (error) {
            return res.status(400).json({ error });
        } else if (category) {
            return res.status(200).json({ category });
        }
    });
};
