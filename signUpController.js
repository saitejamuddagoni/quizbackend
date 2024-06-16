const User = require("../../models/User");
const bcrypt = require("bcryptjs");

module.exports = async function signUpController(req, res) {
  try {
    // Get the email, password, and role from the request body
    const { name, email, password, role } = req.body;

    // Check if a user with the same email already exists
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).send("Email already in use");
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user in the database
    const newUser = new User({ name, email, password: hashedPassword, role });
    await newUser.save();

    // Send a success response
    res.status(201).send("User created successfully");
  } catch (err) {
    // If there is an error, return a 500 status code with the error message
    res.status(500).send(err.message);
  }
};
/*{
  "success": true,
  "message": "User registered successfully"
}
 */