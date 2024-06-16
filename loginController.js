const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require("dotenv");
dotenv.config();

module.exports = async function Login(req, res) {
  try {
    // Get the email and password from the request body
    const { email, password } = req.body;

    // Find the user with the matching email
    const user = await User.findOne({ email });

    // If the user was not found, return a 401 status code with a message
    if (!user) return res.status(401).send('Invalid email or password');

    // Check if the provided password matches the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);

    // If the passwords do not match, return a 401 status code with a message
    if (!isMatch) return res.status(401).send('Invalid email or password');

    // Extract only the necessary properties from the user object
    const { name, email: userEmail, role } = user;

    // Create a JWT using the `createJwt` function
    const token = createJwt({ name, email: userEmail, role });

    // Send the success response with the JWT in the response
    res.status(200).send({ success: true, token });
  } catch (err) {
    // If there is an error, return a 500 status code with the error message
    res.status(500).send(err.message);
  }
};

function createJwt(user) {
  const payload = { 
    name: user.name,
    email: user.email,
    role: user.role
  };
  const options = { expiresIn: process.env.JWT_EXPIRES_IN };
  return jwt.sign(payload, process.env.JWT_SECRET, options);
}
