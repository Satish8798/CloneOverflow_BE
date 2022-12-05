const mongoose = require("mongoose");
const model= mongoose.model;
const Schema = mongoose.Schema;

//creating schema for user
const userSchema = new Schema({
    name: {
        type: String,
        trim: true,
        minLength: 3,
        maxLength: 30,
        required: true
    },
    email:{
        type: String,
        lowercase: true,
        trim: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
        required: true,
        unique: [true, "Email already exists"]
    },
    password:{
        type: String,
        minLength: 6,
        required: true
    },
    about:{
        type: String
    },
    questions:[mongoose.ObjectId],
    answers:[mongoose.ObjectId]
});

//creating model for mentor schema
userModel = model("users",userSchema);
module.exports = userModel;