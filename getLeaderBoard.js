const MockTest = require("../../models/MockTest");
const User = require("../../models/User");

async function teacherLeaderboard(req, res) {
  try {
    const { teacherEmail, mockTestId } = req.body;

    if (!teacherEmail || !mockTestId) {
      return res.status(400).send("Teacher Email and Mock Test ID are required");
    }

    const teacher = await User.findOne({ email: teacherEmail, role: "teacher" });
    const mockTest = await MockTest.findById(mockTestId).populate("questions").populate("author");

    if (!teacher || !mockTest) {
      return res.status(404).send("Teacher or Mock Test not found");
    }

    if (!mockTest.author._id.equals(teacher._id)) {
      return res.status(403).send("This Mock Test was not created by the provided teacher");
    }

    await mockTest.populate("leaderboard.user", "name");

    const formattedLeaderboard = mockTest.leaderboard.map((entry, index) => ({
      name: entry.user.name,
      score: entry.score,
      rank: index + 1,
    }));

    res.status(200).json({ leaderboard: formattedLeaderboard });
  } catch (error) {
    res.status(500).send(error.message);
  }
}

module.exports = teacherLeaderboard;
