// controllers/userController.js
const User = require('../../models/User');
const MockTest = require('../../models/MockTest');

async function purchaseMockTest(req, res) {
  try {
    const { email, mockTestId } = req.body;

    if (!email || !mockTestId) {
      return res.status(400).send('Email and Mock Test ID are required');
    }

    // Find user and mock test by email and ID
    const user = await User.findOne({ email });
    const mockTest = await MockTest.findById(mockTestId);

    if (!user || !mockTest) {
      return res.status(404).send('User or Mock Test not found');
    }

    // Check if the user has enough coins
    if (user.coins < mockTest.price) {
      return res.status(400).send('Not enough coins to purchase the mock test');
    }

    // Deduct the price of the mock test from the user's coins
    user.coins -= mockTest.price;

    // Add the mock test to the user's purchases
    user.purchases.push({ mockTest: mockTest._id });

    // Save the updated user
    await user.save();

    res.status(200).send('Mock Test purchased successfully');
  } catch (error) {
    res.status(500).send(error.message);
  }
}

module.exports = purchaseMockTest;
