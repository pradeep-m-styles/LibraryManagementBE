const Review = require("../models/Review");


// Add Review
const addReview = async (req, res) => {

  try {

    const {
      userId,
      bookId,
      rating,
      comment
    } = req.body;

    const review = await Review.create({
      user: userId,
      book: bookId,
      rating,
      comment
    });

    res.status(201).json(review);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });
  }
};


// Get Reviews
const getReviews = async (req, res) => {

  try {

    const reviews = await Review.find()
      .populate("user", "name")
      .populate("book", "title");

    res.json(reviews);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });
  }
};


module.exports = {
  addReview,
  getReviews
};