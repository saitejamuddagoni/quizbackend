const MockTest = require("../../models/MockTest");
const User = require("../../models/User");
async function testSubmit(req, res) {
  try {
    const { email, mockTestId, correctAnswers } = req.body;

    if (!email || !mockTestId || !correctAnswers) {
      return res.status(400).send("Email, Mock Test ID, and correct answers are required");
    }

    const user = await User.findOne({ email });
    const mockTest = await MockTest.findById(mockTestId).populate("questions");

    if (!user || !mockTest) {
      return res.status(404).send("User or Mock Test not found");
    }

    // Calculate the score
    let score = 0;
    mockTest.questions.forEach((question, index) => {
      if (question.options[question.correctAnswer] === question.options[correctAnswers[index]]) {
        score++;
      }
    });

    // Update leaderboard
    const userIndex = mockTest.leaderboard.findIndex((entry) => entry.user.equals(user._id));
    if (userIndex === -1) {
      mockTest.leaderboard.push({ user: user._id, score });
    } else {
      mockTest.leaderboard[userIndex].score = Math.max(mockTest.leaderboard[userIndex].score, score);
    }

    // Sort the leaderboard by score (descending) and calculate the rank
    mockTest.leaderboard.sort((a, b) => b.score - a.score);
    const rank = mockTest.leaderboard.findIndex((entry) => entry.user.equals(user._id)) + 1;

    await mockTest.save();

    // Populate the leaderboard with user names
    await mockTest.populate("leaderboard.user", "name");

    // Format the leaderboard data
    const formattedLeaderboard = mockTest.leaderboard.map((entry, index) => ({
      name: entry.user.name,
      score: entry.score,
      rank: index + 1,
    }));

    res.status(200).json({ score, rank, leaderboard: formattedLeaderboard });
  } catch (error) {
    res.status(500).send(error.message);
  }
}

module.exports = testSubmit;
