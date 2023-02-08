const userModel = require("../Models/userModel");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

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

  //userDetails
  const userDetails = {
    name: user.name,
    email: user.email,
    about: user.about,
    _id: user["_id"],
  };
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
  let token = jwt.sign(user.toJSON(), process.env.SECRET_KEY);

  res.send({
    token,
    userDetails,
  });
};

module.exports.search = async (req, res, next) => {
  try {
    const response = await userModel.find({ email: req.body.email });
    console.log(response);
    if (response.length > 0) {
      let otp = await sendOtp(response[0].email);
      const updateResponse = await userModel.update(
        { email: req.body.email },
        { $set: { otpUsed: otp } }
      );
      if (response) {
        res.status(200).send({
          msg: true,
        });
      }
    } else {
      res.status(200).send({
        msg: false,
      });
    }
  } catch (error) {
    if (error) {
      // console.log(error)
      res.status(500).send({
        msg: error,
      });
    }
  }
};

module.exports.getUserQuestions = async (req, res) => {
  try {
    let userId = req.params.userId;
    userId = mongoose.Types.ObjectId(userId);
    const response = await userModel
      .aggregate([
        {
          $match: { _id: userId },
        },
      ])
      .lookup({
        from: "questions",
        localField: "questions",
        foreignField: "_id",
        as: "userQuestions",
      })
      .project({
        userQuestions: 1,
      });
    res.send(response);
  } catch (error) {
    if (error) {
      console.log(error);
      res.status(500).send({
        msg: "error",
      });
    }
  }
};

module.exports.resetPassword = async (req, res) => {
  try {
    if (req.body.newPassword === req.body.confirmPassword) {
      const randomString = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(
        req.body.newPassword,
        randomString
      );
      const response = await userModel.update(
        { email: req.body.email },
        { $set: { password: hashedPassword } }
      );
      if (response) {
        res.status(200).send({
          msg: true,
        });
      }
    } else {
      res.status(200).send({
        msg: false,
      });
    }
  } catch (error) {
    res.status(500).send({
      msg: error,
    });
  }
};

module.exports.otpCheck = async (req, res) => {
  const response = await userModel.find({ email: req.body.email });

  if (response.length > 0) {
    if (parseInt(req.body.otp) === response[0].otpUsed) {
      res.status(200).send({
        msg: true,
      });
    } else {
      res.status(200).send({
        msg: false,
      });
    }
  } else {
    res.status(400).send({
      msg: false,
    });
  }
};


//function to sedn otp to gmail
function sendOtp(email) {
  let otp = parseInt(Math.random() * 10000);
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.gmail,
      pass: process.env.password,
    },
  });
  var mailOptions = {
    from: process.env.gmail,
    to: email,
    subject: "OTP for changing password",
    html:
      "<h2>Please Enter this OTP to reset password</h2><br><p>[ " +
      otp +
      " ]</p>",
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent" + info.response);
    }
  });

  return otp;
}


//module for updating the user details
module.exports.updateUser = async (req, res) => {
  let updatedDetails = req.body;
  try {
    const response = await userModel.updateOne(
      { email: req.body.email },
      { name: req.body.name, about: req.body.about }
    );
    res.status(200).send({
      msg:true
    })
  } catch (error) {
    res.status(400).send({
      msg: false
    })
  }
};
