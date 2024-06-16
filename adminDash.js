// controllers/adminController.js
const MockTest = require('../../models/MockTest');

const adminDash = async (req, res) => {
  try {
    const mockTests = await MockTest.find().populate('author', 'name');
    const result = mockTests.map(test => ({
      name: test.name,
      authorName: test.author.name,
      price: test.price
    }));

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching the mock tests' });
  }
};

module.exports =  adminDash 
