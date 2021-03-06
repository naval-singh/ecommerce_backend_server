const slugify = require("slugify");
const Product = require("../models/product");

exports.addProduct = (req, res) => {
    let productPictures = [];
    const { name, price, quantity, description, category } = req.body;

    const productObj = {
        name,
        slug: slugify(name),
        price,
        quantity,
        description,
        category,
        createdBy: req.user._id,
    };
    if (req.files.length > 0) {
        productPictures = req.files.map((file) => {
            return file.filename;
        });
        productObj.productPictures = productPictures;
    }
    const _product = new Product(productObj);
    _product.save((error, product) => {
        if (error) {
            return res.status(200).json({ status: false, error });
        }
        if (product) {
            return res.status(200).json({ status: true, product });
        }
    });
};

exports.displayProduct = (req, res) => {
    Product.find({}).exec((error, products) => {
        if (error) {
            return res.status(200).json({ status: false, error });
        }
        if (products) {
            return res.status(200).json({ status: true, products });
        }
    })
}
