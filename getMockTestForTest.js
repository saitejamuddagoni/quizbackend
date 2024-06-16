// controllers/mockTestController.js
const MockTest = require("../../models/MockTest");
const User = require("../../models/User");

async function getMockTestById(req, res) {
  try {
    const { mockTestId, email } = req.body;

    if (!mockTestId || !email) {
      return res.status(400).send("Mock test ID and email are required");
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).send("User not found");
    }

    const mockTest = await MockTest.findById(mockTestId)
      .populate("author", "name")
      .populate({
        path: "questions",
        select: "text options correctOption",
      });

    if (!mockTest) {
      return res.status(404).send("Mock test not found");
    }

    const purchased = user.purchases.some((purchase) => purchase.mockTest.equals(mockTestId));

    return res.status(200).json({ mockTest, purchased });
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

module.exports = getMockTestById;
