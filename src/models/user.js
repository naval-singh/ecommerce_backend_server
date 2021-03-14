const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            trim: true,
            required: true,
        },
        lastName: {
            type: String,
            trim: true,
            required: true,
        },
        email: {
            type: String,
            trim: true,
            required: true,
            unique: true,
            lowercase: true,
        },
        hashPassword: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
        },
    },
    { timestamps: true }
);

userSchema.virtual("fullName").get(function () {
    return `${this.firstName} ${this.lastName}`;
});

// userSchema.virtual("password").set(async function (password) {
//     this.hashPassword = await bcrypt.hash(password, 10);
// });

userSchema.methods = {
    authenticate: async function (password) {
        return await bcrypt.compare(password, this.hashPassword);
    },
};

const User = mongoose.model("User", userSchema);
module.exports = User;
