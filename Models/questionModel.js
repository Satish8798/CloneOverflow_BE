const mongoose = require("mongoose");
const model= mongoose.model;
const Schema = mongoose.Schema;

const questionSchema = new Schema({
    title: {
        type: String,
        trim: true,
        minLength: 15,
        maxLength: 60,
        required: true
    },

    description: {
        type: String,
        trim: true,
        minLength: 20,
        required: true
    },

    userName: {
        type: String
    },

    userEmail: {
        type:String
    },

    user: { 
        type: mongoose.ObjectId,
        required: true
    },

    votes: {
        type: Number,
        default: 0
    },

    views: {
        type: Number,
        default: 0
    },

    tags:[String],

    answers: [mongoose.ObjectId]
});

const questionModel = model("questions", questionSchema);

module.exports=questionModel;