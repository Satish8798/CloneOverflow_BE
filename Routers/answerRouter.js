const express=require("express");
const AuthModule = require("../Modules/AuthModule");
const answerModule = require("../Modules/answerModule");

const router = express.Router();

router.post("/create-answer",AuthModule.authenticateUser,answerModule.createAnswer);
router.post("/get",answerModule.getAnswers);
router.post("/up-vote",AuthModule.authenticateUser,answerModule.upVote);
router.post("/down-vote",AuthModule.authenticateUser,answerModule.downVote);

module.exports= router