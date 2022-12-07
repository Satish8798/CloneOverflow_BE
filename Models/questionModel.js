const mongoose = require("mongoose");
const model= mongoose.model;
const Schema = mongoose.Schema;

const questionSchema = new Schema({
    title: {
        type: String,
        trim: true,
        minLength: 15,
        maxLength: 100,
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

    votes: [mongoose.ObjectId],

    views: [mongoose.ObjectId], 

    tags:[String],

    answers: [mongoose.ObjectId],
    
    date: {
        type: Date
    }
});

const questionModel = model("questions", questionSchema);

module.exports=questionModel;