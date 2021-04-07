const { response } = require("express");
const Cart = require("../models/cart");

const runUpdate = (condition, updation) => {
    return new Promise((resolve, reject) => {
        Cart.findOneAndUpdate(condition, updation, { upsert: true })
            .then((result) => resolve())
            .catch((err) => reject(err));
    });
};

exports.addItemToCart = (req, res) => {
    const { cartItems } = req.body;

    Cart.findOne({ user: req.user._id }).exec((error, existingCart) => {
        if (error) {
            return res.status(200).json({ status: false, error });
        } else if (existingCart) {
            let promiseArray = [];
            cartItems.forEach((cartItem) => {
                let condition, updation;
                const item = existingCart.cartItems.find((c) => c.product == cartItem.product);
                if (item) {
                    condition = { user: req.user._id, "cartItems.product": cartItem.product };
                    updation = {
                        $set: {
                            "cartItems.$": cartItem,
                        },
                    };
                } else {
                    condition = { user: req.user._id };
                    updation = {
                        $push: {
                            "cartItems": cartItem,
                        },
                    };
                }
                promiseArray.push(runUpdate(condition, updation));
            });
            Promise.all(promiseArray)
                .then((response) => res.status(200).json({ status: true, response }))
                .catch((error) => res.status(200).json({ status: false, error }));
        } else {
            const cartObj = {
                user: req.user._id,
                cartItems: cartItems,
            };
            const _cart = new Cart(cartObj);
            _cart.save((error, newlyAddedCart) => {
                if (error) {
                    return res.status(200).json({ status: false, error });
                }
                if (newlyAddedCart) {
                    return res.status(200).json({ status: true, newlyAddedCart });
                }
            });
        }
    });
};

exports.getCartItems = (req, res) => {
    Cart.findOne({ user: req.user._id })
    .populate({path: 'cartItems.product', select: '_id name quantity price listPrice productPictures'})
    .exec((error, cart) => {
        if (error) {
            return res.status(200).json({ status: false, error });
        } else if (cart) {
            let cartItems = {};
            cart.cartItems.map((item)=>{
                cartItems[item.product._id] = {
                    _id: item.product._id,
                    name: item.product.name,
                    qty: item.quantity,
                    stock: item.product.quantity,
                    price: item.product.price,
                    listPrice: item.product.listPrice,
                    img: item.product.productPictures[0]
                }
            })
            return res.status(200).json({ status: true, cartItems });
        }
    });
};

// exports.addItemToCart = (req, res) => {
//     const { cartItems } = req.body;

//     Cart.findOne({ user: req.user._id }).exec((error, existingCart) => {
//         if (error) {
//             return res.status(200).json({ status: false, error });
//         } else if (existingCart) {
//             let condition, updation;
//             const item = existingCart.cartItems.find((c) => c.product == cartItems.product);
//             if (item) {
//                 condition = { user: req.user._id, "cartItems.product": cartItems.product };
//                 updation = {
//                     $set: {
                        // "cartItems.$": {
                        //     ...cartItems,
                        //     quantity: item.quantity + cartItems.quantity,
                        // },
//                     },
//                 };
//             } else {
//                 condition = { user: req.user._id };
//                 updation = {
//                     $push: {
//                         cartItems: cartItems,
//                     },
//                 };
//             }
//             Cart.findOneAndUpdate(condition, updation).exec((error, updatedCart) => {
//                 if (error) {
//                     return res.status(200).json({ status: false, error });
//                 }
//                 if (updatedCart) {
//                     return res.status(200).json({ status: true, updatedCart });
//                 }
//             });
//         } else {
//             const cartObj = {
//                 user: req.user._id,
//                 cartItems: [cartItems],
//             };
//             const _cart = new Cart(cartObj);
//             _cart.save((error, newlyAddedCart) => {
//                 if (error) {
//                     return res.status(200).json({ status: false, error });
//                 }
//                 if (newlyAddedCart) {
//                     return res.status(200).json({ status: true, newlyAddedCart });
//                 }
//             });
//         }
//     });
// };
