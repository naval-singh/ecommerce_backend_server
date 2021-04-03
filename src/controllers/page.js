const Page = require("../models/page");

exports.createPage = (req, res) => {
    const { banners, products } = req.files;
    if (banners.length > 0) {
        req.body.banners = banners.map((banner) => ({
            img: banner.filename,
            navigateTo: `/bannerClicked?categoryId=${req.body.category}&type=${req.body.type}`,
        }));
    }
    if (products.length > 0) {
        req.body.products = products.map((product) => ({
            img: product.filename,
            navigateTo: `/productClicked?categoryId=${req.body.category}&type=${req.body.type}`,
        }));
    }
    req.body.createdBy = req.user._id;

    // res.status(200).json({body: req.body})

    Page.findOne({ category: req.body.category }).exec((error, existingPage) => {
        if (error) {
            return res.status(200).json({ status: false, error });
        } else if (existingPage) {
            Page.findOneAndUpdate({ category: req.body.category }, req.body).exec((error, page) => {
                if (error) {
                    return res.status(200).json({ status: false, error });
                } else if (page) {
                    return res.status(200).json({ status: true, page });
                }
            });
        } else {
            const _page = new Page(req.body);
            _page.save((error, page) => {
                if (error) {
                    return res.status(200).json({ status: false, error });
                } else if (page) {
                    return res.status(200).json({ status: true, page });
                }
            });
        }
    });
};

exports.getPageById = (req, res) => {
    const { category, type } = req.params;
    if (type === "page") {
        Page.findOne({ category }).exec((error, page) => {
            if (error) {
                return res.status(200).json({ status: false, error });
            } else if (page) {
                return res.status(200).json({ status: true, page });
            }
        });
    } else {
        return res.status(200).json({ status: false, error: "product type should be page" });
    }
};

exports.getAllPages = (req, res) => {
    Page.find({}).exec((error, pages) => {
        if (error) {
            return res.status(200).json({ status: false, error });
        } else if (pages) {
            return res.status(200).json({ status: true, pages });
        }
    });
};
