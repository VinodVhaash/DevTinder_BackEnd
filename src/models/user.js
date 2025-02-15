const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
  },
  emailId: {
    type: String,
    unique: true,
    lowercase: true,
    index: true,
    required: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Invalid Email address: " + value);
      }
    },
  },
  password: {
    type: String,
  },
  age: {
    type: Number,
  },
  gender: {
    type: String,
  },
  about: {
    type: String,
    default: "Its a default field.",
  },
  skills: {
    type: [String],
    validate: {
      validator: function (v) {
        return v.length <= 3; // Validate that the length is 3 or fewer
      },
      message: (props) => `${props.value} exceeds the limit of 3 skills!`,
    },
    required: true,
  },
});

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: this._id }, "DEV@Tinder$0823", {
    expiresIn: "1h",
  });
  return token;
};

userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  const passwordHash = user.password;

  const isPasswordValid = await bcrypt.compare(
    passwordInputByUser,
    passwordHash
  );
  return isPasswordValid;
};
module.exports = mongoose.model("User", userSchema);
