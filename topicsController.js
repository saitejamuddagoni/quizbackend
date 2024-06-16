// controllers/chapterController.js
const Exam = require("../../models/Exam");
const Subject = require("../../models/Subject");
const Chapter = require("../../models/Chapter");

async function getTopicsByExamAndSubject(req, res) {
  try {
    const { examName, subjectName } = req.body;

    if (!examName || !subjectName) {
      return res.status(400).send("Exam name and subject name are required");
    }

    // Find the exam and subject based on the given names
    const exam = await Exam.findOne({ name: examName });
    const subject = await Subject.findOne({ name: subjectName, exam: exam._id });

    if (!exam || !subject) {
      return res.status(404).send("Exam or subject not found");
    }

    // Find chapters (topics) associated with the subject
    const chapters = await Chapter.find({ subject: subject._id }).select("name");

    res.status(200).json(chapters);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

module.exports = getTopicsByExamAndSubject
