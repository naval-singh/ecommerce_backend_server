const slugify = require("slugify");
const Product = require("../models/product");
const Category = require("../models/category");

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
    });
};

exports.getProductsBySlug = (req, res) => {
    const { slug } = req.params;
    Category.findOne({ slug })
        .select("_id")
        .exec((error, category) => {
            if (error) {
                return res.status(200).json({ status: false, error });
            }
            if(category){
                Product.find({category}).exec((error, products)=>{
                    if (error) {
                        return res.status(200).json({ status: false, error });
                    }
                    if(products.length > 0){
                        return res.status(200).json({
                            status: true,
                            products,
                            productsByPrice: {
                                under5k: products.filter(product => product.price <= 5000),
                                under10k: products.filter(product => product.price > 5000 && product.price <= 10000),
                                under15k: products.filter(product => product.price > 10000 && product.price <= 15000),
                                under20k: products.filter(product => product.price > 15000 && product.price <= 20000),
                                under30k: products.filter(product => product.price > 20000 && product.price <= 30000)
                            }
                        });
                    }
                })
            }
        });
};
