const Exam = require("../../models/Exam");

async function getAllExamNames(req, res) {
  try {
    // Find all exams
    const exams = await Exam.find();

    // Extract the names of the exams
    const examNames = exams.map((exam) => exam.name);

    // Return the exam names
    res.send(examNames);
  } catch (err) {
    // If there is an error, log the error and return an empty array
    console.error(err);
    res.send(err)
  }
}
module.exports = getAllExamNames;