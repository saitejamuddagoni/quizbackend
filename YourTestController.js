const User = require('../../models/User');

const getUserPurchases = async (req, res) => {
  try {
    // Get user email from request body
    const userEmail = req.body.email;

    // Find user by email
    const user = await User.findOne({ email: userEmail });

    // Check if the user exists
    if (!user) {
      return res.status(404).send('User not found');
    }

    // Populate purchases with MockTest reference, and populate the author's name
    const userDetails = await User.findOne({ email: userEmail })
      .populate({
        path: 'purchases.mockTest',
        select: '_id name author',
        populate: {
          path: 'author',
          select: 'name'
        }
      })
      .lean();

    // Extract the user's purchased mock test ids, names, and author names
    const purchasedMockTests = userDetails.purchases.map(purchase => {
      return {
        id: purchase.mockTest._id,
        name: purchase.mockTest.name,
        author: purchase.mockTest.author.name
      };
    });

    // Filter out duplicate mock tests by id
    const uniquePurchasedMockTests = purchasedMockTests.filter((test, index, self) => {
      return index === self.findIndex(t => t.id.equals(test.id));
    });

    // Return the user's purchased mock test ids, names, and author names without duplicates
    res.json(uniquePurchasedMockTests);
  } catch (err) {
    // If there is an error, return a 500 status code with the error message
    res.status(500).send(err.message);
  }
};

module.exports = getUserPurchases;
