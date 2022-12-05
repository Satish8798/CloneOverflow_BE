const express = require("express");
const dotenv = require("dotenv");
const dbConnection = require("./databaseConnection");
const userRouter = require("./Routers/userRouter");
const cors = require("cors");
const AuthModule = require("./Modules/AuthModule");
const questionRouter = require("./Routers/questionsRouter");
const answerRouter = require("./Routers/answerRouter");

dotenv.config();

const app = express();

dbConnection.connectMongoose();

app.use(cors());
app.use(express.json());

app.use("/user", userRouter);
app.use("/questions",questionRouter);
app.use("/answers",answerRouter);

app.listen(process.env.PORT, () => {
  console.log("server running on port : " + process.env.PORT);
});
