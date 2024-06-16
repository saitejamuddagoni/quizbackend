const Exam    = require("../../models/Exam");
const Subject = require("../../models/Subject");

async function getSubjectsByExamName(req, res) {
  try {
    const examName = req.body.name;

    if (!examName) {
      return res.status(400).send("Exam name is required");
    }

    const exam = await Exam.findOne({ name: examName });

    if (!exam) {
      return res.status(404).send("Exam not found");
    }

    const subjects = await Subject.find({ exam: exam._id }).select("name");

    // Map subjects to plain JavaScript objects
    const subjectsPlainObjects = subjects.map((subject) => subject.toObject());

    res.status(200).json(subjectsPlainObjects);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

module.exports =   getSubjectsByExamName;

