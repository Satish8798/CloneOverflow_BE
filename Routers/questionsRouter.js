const express= require("express");
const questionModule = require("../Modules/QuestionModule");
const AuthModule = require("../Modules/AuthModule")

const router= express.Router();

router.post("/create-question",AuthModule.authenticateUser,questionModule.createQuestion);
router.get("/get",questionModule.getQuestions);
router.put("/upvote",AuthModule.authenticateUser,questionModule.upVote);
router.put("/downvote",AuthModule.authenticateUser,questionModule.downVote);
router.get("/get-results",questionModule.getResults);
router.post("/:questionId",questionModule.getQuestionDetails);
router.delete("/delete/:questionId",questionModule.deleteQuestion);


module.exports= router