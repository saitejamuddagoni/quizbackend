const Exam = require("../../models/Exam");
const Chapter = require("../../models/Chapter");
const MockTest = require("../../models/MockTest");
const Subject = require("../../models/Subject");
const User = require("../../models/User");

async function getMockTestsByExamSubjectAndChapter(req, res) {
  try {
    const { examName, subjectName, chapterName, email } = req.body;

    if (!examName || !subjectName || !chapterName || !email) {
      return res.status(400).send("Exam name, subject name, chapter name, and email are required");
    }

    // Find the exam, subject, and chapter based on the given names
    const exam = await Exam.findOne({ name: examName });
    if (!exam) return res.status(404).send("Exam not found");

    const subject = await Subject.findOne({ name: subjectName, exam: exam._id });
    if (!subject) return res.status(404).send("Subject not found");

    const chapter = await Chapter.findOne({ name: chapterName, subject: subject._id });
    if (!chapter) return res.status(404).send("Chapter not found");

    const user = await User.findOne({ email: email });
    if (!user) return res.status(404).send("User not found");

    // Populate the user's purchases field with the MockTest model
    const populatedUser = await user.populate({ path: 'purchases.mockTest' });

    // Find mock tests associated with the chapter and populate the necessary fields
    let mockTests = await MockTest.find({ chapter: chapter._id })
      .populate("author", "name")
      .select("name author price");

    // Add a 'bought' field to each mock test, indicating whether the user has bought it or not
    mockTests = mockTests.map((mockTest) => {
      const bought = populatedUser.purchases.some((purchase) => purchase.mockTest._id.equals(mockTest._id));
      return { ...mockTest.toObject(), bought: bought };
    });

    res.status(200).json(mockTests);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

module.exports = getMockTestsByExamSubjectAndChapter;
