const MockTest = require("../../models/MockTest");
const User = require("../../models/User");

async function getMockTestsByAuthor(req, res) {
  try {
    const authorEmail = req.body.email;

    if (!authorEmail) {
      return res.status(400).send("Invalid request, missing author email");
    }

    const author = await User.findOne({ email: authorEmail });

    if (!author) {
      return res.status(404).send("Author not found");
    }

    const mockTests = await MockTest.find({ author: author._id })
      .populate("author", "-_id -email -password")
      .populate({
        path: "chapter",
        select: "-_id name",
        populate: {
          path: "subject",
          select: "-_id name",
        },
      })
      .populate("questions", "-_id");

    res.status(200).json(mockTests);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

module.exports = getMockTestsByAuthor;
