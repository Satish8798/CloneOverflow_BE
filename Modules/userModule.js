const userModel = require("../Models/userModel");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports.signup = async (req, res) => {
  //email id check in databasse
  const user = await userModel.findOne({ email: req.body.email });
  if (user) {
    return res.status(400).send({
      msg: "email already exists",
    });
  }

  //confirming the password
  if (req.body.password !== req.body.confirmPassword) {
    return res.status(400).send({
      msg: "password not matching",
    });
  }

  //if password is matching , the deleting the confirm password field
  delete req.body.confirmPassword;

  //generating the saltstring
  const randomString = await bcrypt.genSalt(10);

  //hashing the password
  const hashedPassword = await bcrypt.hash(req.body.password, randomString);

  //creating a new document in users collection
  const userData = new userModel({ ...req.body, password: hashedPassword });

  //saving the new user data in database
  try {
    await userData.save();
    res.status(200).send({
      msg: true,
    });
  } catch (error) {
    res.status(400).send({
      msg: error,
    });
  }
};

module.exports.login = async (req, res) => {
  //Email id check in database
  const user = await userModel.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).send({
      msg: "email does not exist",
    });
  }

  //password comparison
  const passwordMatchResponse = await bcrypt.compare(
    req.body.password,
    user.password
  );
  if (!passwordMatchResponse) {
    return res.status(400).send({
      msg: "invalid password",
    });
  }

  //generating json web token and send
  let token = jwt.sign(user.toJSON(),process.env.SECRET_KEY);

  res.send({
    token,
    user
  });

};
