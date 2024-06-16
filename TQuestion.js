
const MockTest = require("../../models/MockTest");
const User = require("../../models/User");
async function getMockTestWithCorrectAnswerById(req, res) {
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
  
      // Check if the user is the author of the mock test
      const isAuthor = user._id.equals(mockTest.author._id);
  
      if (!isAuthor) {
        return res.status(403).send("Access denied: Only the author can view the correct answers");
      }
  
      // Return mock test along with questions and their correct answers
      return res.status(200).json(mockTest);
    } catch (error) {
      return res.status(500).send(error.message);
    }
  }
  
  // Export the new function
  module.exports = {
    getMockTestWithCorrectAnswerById,
  };
  