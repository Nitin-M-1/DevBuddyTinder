const validator = require("validator");
const validateSignUpData = (req) => {
  const {
    firstName,
    lastName,
    password,
    age,
    emailId,
    gender,
    photURL,
    about,
    skill,
  } = req.body;

  // Customize password strength options as needed
  if (
    !validator.isStrongPassword(password, {
      minLength: 7,
      minLowercase: 1,
      minUppercase: 0,
      minNumbers: 0,
      minSymbols: 0,
    })
  )
    throw new Error(
      "Password is not strong (min 7 chars, at least 1 lowercase letter)"
    );
  else if (password.length > 30)
    throw new Error("Password must not exceed 30 characters");
  else if (!validator.isEmail(emailId)) throw new Error("Invalid Email Id");
  else if (photURL && !validator.isURL(photURL))
    throw new Error("Invalid Photo Url");
};

module.exports = {
  validateSignUpData,
};
