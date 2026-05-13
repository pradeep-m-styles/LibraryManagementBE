const express = require("express");
const router = express.Router();

const Book = require("../models/Book");
const User = require("../models/User");
const Borrow = require("../models/Borrow");

// ✅ REAL DATA DASHBOARD API
router.get("/", async (req, res) => {
  try {

    const totalBooks = await Book.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalBorrows = await Borrow.countDocuments();

    const overdueBooks = await Borrow.countDocuments({
      dueDate: { $lt: new Date() },
      returnDate: null
    });

    res.json({
      totalBooks,
      totalUsers,
      totalBorrows,
      overdueBooks
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;