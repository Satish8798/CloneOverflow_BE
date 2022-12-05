const answerModel = require("../Models/answerModel");
const userModel = require("../Models/userModel");
const questionModel = require("../Models/questionModel");

module.exports.createAnswer = async (req, res) => {
  const answer = new answerModel({ ...req.body });
  try {
    const response = await answer.save();
    await userModel.updateOne(
      { _id: response.user },
      { $push: { answers: response["_id"] } }
    );
    await questionModel.updateOne(
        { _id: response.question },
        { $push: { answers: response["_id"] } }
      );
    res.status(200).send({
      msg: true,
    });
  } catch (error) {
    res.status(400).send(error);
  }
};

module.exports.getAnswers = async(req,res)=>{
    try {
        const answers = await answerModel.find({question: req.body.question});
        console.log(req.body.question)
        res.status(200).send(answers);
    } catch (error) {
        res.status(400).send(error);
    }
}