const mongoose = require("mongoose");
const model= mongoose.model;
const Schema = mongoose.Schema;

const answerSchema  = new Schema({
    answer:{
        type:String,
        minLength: 20,
        required: true
    },

    votes:[mongoose.ObjectId],

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
    },
    date:{
        type:Date
    }

});

const answerModel = model("answers",answerSchema);

module.exports = answerModel;