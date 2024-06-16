const User = require("../../models/User");

const getCoins = async (req, res) => {
  try {
    // Get the email from the request
    const { email } = req.body;

    // Find user in the database and get coins
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const coins = user.coins;
    res.status(200).json({ coins });
  } catch (err) {
    res.status(400).json({ message: "Error finding user" });
  }
};

module.exports =  getCoins ;
