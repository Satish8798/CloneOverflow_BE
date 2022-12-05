const express= require("express");
const questionModule = require("../Modules/QuestionModule");
const AuthModule = require("../Modules/AuthModule")

const router= express.Router();

router.post("/create-question",AuthModule.authenticateUser,questionModule.createQuestion);
router.get("/get",questionModule.getQuestions);
router.get("/:questionId",questionModule.getQuestionDetails);

module.exports= router