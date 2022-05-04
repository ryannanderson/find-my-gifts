const bcrypt = require("bcrypt");
const config = require("./config")
const pass = config.keys;
const mongoose = require("mongoose");
mongoose.connect(
  `mongodb+srv://ryann:${pass.password}@cluster0.tp5ta.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
);

const Gift = mongoose.model("Gift", {
  name: { type: String, required: [true, "please specify name"] },
  idea: { type: String, required: [true, "please specify idea"] },
  price: { type: Number, required: [true, "please specify price"] },
  purchased: Boolean,
  event: Date,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, "The gift must belong to a user."]
  }
});

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "Please specify first name"],
  },
  email: {
    type: String,
    required: [true, "Please specify email"],
    unique: true,
  },
  encryptedPassword: {
    type: String,
    required: [true, "Please specify password"],
  },
});

userSchema.methods.setEncryptedPassword = function (plainPassword) {
  // applies to "this" model instance

  let promise = new Promise((resolve, reject) => {
    // TODO: encrypte plainPassword and set on the model instance
    // hash may not need parentheses around it
    bcrypt.hash(plainPassword, 12).then((hash) => {
      // Store hash in your password DB.
      this.encryptedPassword = hash;
      // resolve promise here.
      // this calls then()
      resolve();
    });
  });

  return promise;
};

userSchema.methods.verifyPassword = function (plainPassword) {
    // applies to "this" model instance
  
    let promise = new Promise((resolve, reject) => {
        // compare plainPassword
      bcrypt.compare(plainPassword, this.encryptedPassword).then((result) => {
       
        resolve(result);
      });
    });
  
    return promise;
  };

const User = mongoose.model("User", userSchema);

module.exports = { Gift: Gift, User: User };
