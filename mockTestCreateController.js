const Exam = require("../../models/Exam");
const Subject = require("../../models/Subject");
const Chapter = require("../../models/Chapter");
const MockTest = require("../../models/MockTest");
const Question = require("../../models/Question");
const User = require("../../models/User");

async function mockTestCreate(req, res) {
  try {
    if (
      !req.body.exam ||
      !req.body.subject ||
      !req.body.topic ||
      !req.body.email ||
      !req.body.questions
    ) {
      return res.status(400).send("Invalid request body");
    }

    // Find the user by email
    const user = await User.findOne({ email: req.body.email });

    // If the user was not found, return a 404 status code with a message
    if (!user) return res.status(404).send("User not found");

    // Find or create the exam
    let exam = await Exam.findOne({ name: req.body.exam });
    if (!exam) {
      exam = new Exam({ name: req.body.exam });
      await exam.save();
    }

    // Find or create the subject
    let subject = await Subject.findOne({ name: req.body.subject, exam: exam._id });
    if (!subject) {
      subject = new Subject({ name: req.body.subject, exam: exam._id });
      await subject.save();
    }

    // Find or create the chapter
    let chapter = await Chapter.findOne({ name: req.body.topic, subject: subject._id });
    if (!chapter) {
      chapter = new Chapter({ name: req.body.topic, subject: subject._id });
      await chapter.save();
    }

    // Create questions and store their ids in an array
    const questionIds = [];
    for (const questionData of req.body.questions) {
      const question = new Question(questionData);
      await question.save();
      questionIds.push(question._id);
    }

    // Create a new mock test
    const mockTest = new MockTest({
      name: req.body.name,
      author: user._id,
      price: req.body.price,
      chapter: chapter._id,
      questions: questionIds,
    });

    // Save the mock test to the database
    await mockTest.save();

    // Return a success message
    res.status(201).send("Mock test created successfully");
  } catch (err) {
    // If there is an error, return a 500 status code with the error message
    res.status(500).send(err.message);
  }
}

module.exports = mockTestCreate;
