const express = require("express");
const router = express.Router();

const Borrow = require("../models/Borrow");
const Book = require("../models/Book");


// ✅ BORROW BOOK WITH DUPLICATE PREVENTION
router.post("/", async (req, res) => {

  try {

    const { userId, bookId } = req.body;

    // ✅ CHECK IF ALREADY BORROWED
    const existingBorrow = await Borrow.findOne({
      user: userId,
      book: bookId,
      returnDate: null
    });

    if (existingBorrow) {
      return res.status(400).json({
        message: "Book already borrowed"
      });
    }

    // ✅ CREATE DUE DATE (7 DAYS)
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7);

    // ✅ CREATE BORROW RECORD
    const borrow = await Borrow.create({
      user: userId,
      book: bookId,
      dueDate
    });

    // ✅ UPDATE BOOK STATUS
    await Book.findByIdAndUpdate(bookId, {
      availabilityStatus: "Borrowed"
    });

    res.json({
      message: "Book borrowed successfully",
      borrow
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: err.message
    });
  }
});


// ✅ GET ALL BORROWS
router.get("/", async (req, res) => {

  try {

    const borrows = await Borrow.find()
      .populate("book")
      .populate("user");

    res.json(borrows);

  } catch (err) {

    res.status(500).json({
      message: err.message
    });
  }
});


// ✅ RETURN BOOK
router.put("/return/:id", async (req, res) => {

  try {

    const borrow = await Borrow.findById(req.params.id);

    if (!borrow) {
      return res.status(404).json({
        message: "Borrow record not found"
      });
    }

    // ✅ SET RETURN DATE
    borrow.returnDate = new Date();

    await borrow.save();

    // ✅ UPDATE BOOK STATUS
    await Book.findByIdAndUpdate(borrow.book, {
      availabilityStatus: "Available"
    });

    res.json({
      message: "Book returned successfully"
    });

  } catch (err) {

    res.status(500).json({
      message: err.message
    });
  }
});

module.exports = router;