const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const registerSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,

    },
    password: {
        type: String,
        required: true,

    },

    cpassword: {
        type: String,
        required: true,
    },

    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

registerSchema.methods.generateAuthToken = async function () {
    try {
        console.log(this._id);
        const token = jwt.sign({ _id: this._id.toString() }, process.env.SECRET);
        this.tokens = this.tokens.concat({ token: token });
        await this.save();
        return token;


    } catch (error) {
        res.send("the error part" + error);
        // console.log(`Error in generateAuthToken ${err}`);
    }
}


registerSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
        this.cpassword = await bcrypt.hash(this.cpassword, 10);
    }
    next();
})
const members = new mongoose.model("members", registerSchema);
module.exports = members;