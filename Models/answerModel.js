const mongoose = require("mongoose");
const model= mongoose.model;
const Schema = mongoose.Schema;

const answerSchema  = new Schema({
    answer:{
        type:String,
        minLength: 20,
        required: true
    },

    votes:{
        type: Number,
        default: 0
    },

    userName:{
        type:String
    },

    userEmail:{
        type:String
    },

    user: { 
        type: mongoose.ObjectId,
        required: true
    },

    question:{
        type:mongoose.ObjectId
    }

});

const answerModel = model("answers",answerSchema);

module.exports = answerModel;