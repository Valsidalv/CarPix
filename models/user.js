const mongoose = require("mongoose");
const passportMongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
    username: String,
    password: String
});

userSchema.plugin(passportMongoose);

module.exports = mongoose.model("User", userSchema);