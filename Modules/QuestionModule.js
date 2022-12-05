const questionModel = require("../Models/questionModel");
const mongoose = require("mongoose");
const userModel = require("../Models/userModel");

module.exports.createQuestion = async (req, res) => {
  let tagsArray = req.body.tags;
  tagsArray = tagsArray.split(",");
  tagsArray = tagsArray.map((d) => d.trim());
  const question = new questionModel({ ...req.body, tags: [...tagsArray] });

  try {
    const response = await question.save();
    await userModel.updateOne(
      { _id: response.user },
      { $push: { questions: response["_id"] } }
    );

    res.status(200).send({
      msg: true,
    });
  } catch (error) {
    res.status(400).send(error);
  }
};

module.exports.getQuestions= async (req,res)=>{
    try {
        const response = await questionModel.find({});
        res.status(200).send({
            response
        })
    } catch (error) {
        res.status(400).send(error);
    }
}


module.exports.getQuestionDetails = async (req,res) =>{
    try {
        const question = await questionModel.findOne({_id: req.params.questionId});
        res.status(200).send({
            question
        })
    } catch (error) {
        res.status(400).send(error);
    }
}