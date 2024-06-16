const Exam = require('../../models/Exam');
const User = require('../../models/User');

const  buyExam = async (req, res) => {
  try {
    const { examId } = req.params;
    const { token } = req.body;
    const { coins } = req.body;

    // Find the exam by its ID
    const exam = await Exam.findById(examId);

    // Find the user by their token
    const user = await User.findOne({ email: token.email });

    // Check if the user has enough coins to buy the exam
    if (user.coins < exam.cost) {
      return res.status(400).json({ message: 'Not enough coins to buy exam' });
    }

    // Subtract the cost of the exam from the user's coins
    user.coins -= exam.cost;

    // Add the exam to the user's purchases
    user.purchases.push({ exam: exam._id });

    // Save the updated user object
    await user.save();

    return res.status(200).json({ message: 'Exam purchased successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};
module.exports = buyExam;
//wrong req assignment at top