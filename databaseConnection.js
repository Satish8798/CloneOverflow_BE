const mongoose = require("mongoose");

module.exports = {
  async connectMongoose() {
    try {
      mongoose.connect(process.env.MONGOOSE_URL);
      console.log("connected to database");
    } catch (error) {
      console.log(error);
    }
  },
};