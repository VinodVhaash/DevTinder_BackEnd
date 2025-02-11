const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error("Name is not valid!");
    // } else if (firstName.length < 4 || firstName.length > 40) {
    //   throw new Error("First Name should be 4-40 characters.");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Invalid Email.");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Please enter a strong password.");
  }
};

module.exports = { validateSignUpData };
