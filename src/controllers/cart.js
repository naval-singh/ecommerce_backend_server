const Cart = require("../models/cart");

exports.addItemToCart = (req, res) => {
    const { cartItems } = req.body;

    Cart.findOne({ user: req.user._id }).exec((error, existingCart) => {
        if (error) {
            return res.status(200).json({ status: false, error });
        } else if (existingCart) {
            let condition, updation;
            const item = existingCart.cartItems.find((c) => c.product == cartItems.product);
            if (item) {
                condition = { user: req.user._id, "cartItems.product": cartItems.product };
                updation = {
                    $set: {
                        "cartItems.$": {
                            ...cartItems,
                            quantity: item.quantity + cartItems.quantity,
                        },
                    },
                };
            } else {
                condition = { user: req.user._id };
                updation = {
                    $push: {
                        cartItems: cartItems,
                    },
                };
            }
            Cart.findOneAndUpdate(condition, updation).exec((error, updatedCart) => {
                if (error) {
                    return res.status(200).json({ status: false, error });
                }
                if (updatedCart) {
                    return res.status(200).json({ status: true, updatedCart });
                }
            });
        } else {
            const cartObj = {
                user: req.user._id,
                cartItems: [cartItems],
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
