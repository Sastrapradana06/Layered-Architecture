const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const { insertUser, findUserByEmail } = require("./auth.repository");

const registerUser = async (userData) => {
  const { name, email, password } = userData;
  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await insertUser({ name, email, password: hashedPassword });
  return result;
};

const loginUser = async (email, password) => {
  const user = await findUserByEmail(email);

  if (!user) {
    throw Error("User not found");
  }

  const isMatchPassword = await bcrypt.compare(password, user.password);
  if (!isMatchPassword) {
    throw Error("Invalid password");
  }

  const generateToken = jwt.sign({ name: user.name }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  if (!generateToken) {
    throw Error("Failed to generate token");
  }

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    token: generateToken,
  };
};

module.exports = {
  registerUser,
  loginUser,
};
