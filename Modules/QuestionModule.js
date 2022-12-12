const questionModel = require("../Models/questionModel");
const mongoose = require("mongoose");
const userModel = require("../Models/userModel");

module.exports.createQuestion = async (req, res) => {
  const question = new questionModel({ ...req.body });

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

module.exports.getQuestions = async (req, res) => {
  try {
    const response = await questionModel.find({});
    res.status(200).send({
      response,
    });
  } catch (error) {
    res.status(400).send(error);
  }
};

module.exports.getQuestionDetails = async (req, res) => {
  try {
    const question = await questionModel.findOne({
      _id: req.params.questionId,
    });
    const viewer = mongoose.Types.ObjectId(req.body.user);
    if (viewer.valueOf() !== question.user.valueOf()) {
      if (!question.views.includes(viewer)) {
        await questionModel.updateOne(
          { _id: question["_id"] },
          { $push: { views: viewer } }
        );
      }
    }
    res.status(200).send({
      question,
    });
  } catch (error) {
    res.status(400).send(error);
  }
};

module.exports.upVote = async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.body.userEmail });
    const question = await questionModel.findOne({ _id: req.body.question });
    if (question.votes.includes(user["_id"])) {
      res.status(200).send({
        msg: "already voted",
      });
    } else {
      await questionModel.updateOne(
        { _id: req.body.question },
        {
          $push: { votes: user["_id"] },
        }
      );

      res.status(200).send({
        msg: "vote added",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(400).send({
      error,
    });
  }
};

module.exports.downVote = async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.body.userEmail });
    const question = await questionModel.findOne({ _id: req.body.question });
    if (!question.votes.includes(user["_id"])) {
      res.status(200).send({
        msg: "not voted before",
      });
    } else {
      await questionModel.updateOne(
        { _id: req.body.question },
        {
          $pull: { votes: user["_id"] },
        }
      );

      res.status(200).send({
        msg: "vote removed",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(400).send({
      error,
    });
  }
};

module.exports.getResults = async (req, res) => {
  let tag = req.query.tag;
  tag = tag.toLowerCase();
  try {
    const results = await questionModel.find({ tags: tag });
    res.status(200).send({
      results,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      error,
    });
  }
};
