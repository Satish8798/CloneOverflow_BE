const express= require("express");
const questionModule = require("../Modules/QuestionModule");
const AuthModule = require("../Modules/AuthModule")

const router= express.Router();

router.post("/create-question",AuthModule.authenticateUser,questionModule.createQuestion);
router.get("/get",questionModule.getQuestions);
router.post("/upvote",AuthModule.authenticateUser,questionModule.upVote);
router.post("/downvote",AuthModule.authenticateUser,questionModule.downVote);
router.get("/get-results",questionModule.getResults);
router.post("/:questionId",questionModule.getQuestionDetails);


module.exports= router