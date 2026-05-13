const Borrow = require("../models/Borrow");

const Book = require("../models/Book");

const User = require("../models/User");

const sendEmail = require("../utils/sendEmail");


// Borrow Book
const borrowBook = async (req, res) => {

  try {

    const { userId, bookId } = req.body;

    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({
        message: "Book not found"
      });
    }

    if (book.quantity <= 0) {
      return res.status(400).json({
        message: "Book unavailable"
      });
    }

    const dueDate = new Date();

    dueDate.setDate(dueDate.getDate() + 7);

    const borrow = await Borrow.create({
      user: userId,
      book: bookId,
      dueDate
    });

    // Reduce Quantity
    book.quantity -= 1;

    if (book.quantity === 0) {
      book.available = false;
    }

    await book.save();

    // Send Email
    const user = await User.findById(userId);

    await sendEmail(
      user.email,
      "Book Borrowed",
      `You borrowed "${book.title}" successfully.`
    );

    res.status(201).json({
      message: "Book borrowed successfully",
      borrow
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });
  }
};



// Return Book
const returnBook = async (req, res) => {

  try {

    const borrow = await Borrow.findById(req.params.id);

    if (!borrow) {
      return res.status(404).json({
        message: "Borrow record not found"
      });
    }

    if (borrow.returnDate) {
      return res.status(400).json({
        message: "Book already returned"
      });
    }

    const returnDate = new Date();

    borrow.returnDate = returnDate;

    let fine = 0;

    // Fine Calculation
    if (returnDate > borrow.dueDate) {

      const daysLate = Math.ceil(
        (returnDate - borrow.dueDate) /
        (1000 * 60 * 60 * 24)
      );

      fine = daysLate * 10;
    }

    borrow.fine = fine;

    await borrow.save();

    // Update Book Quantity
    const book = await Book.findById(borrow.book);

    book.quantity += 1;

    book.available = true;

    await book.save();

    // Send Email
    const user = await User.findById(borrow.user);

    await sendEmail(
      user.email,
      "Book Returned",
      `You returned "${book.title}" successfully. Fine: ₹${fine}`
    );

    res.json({
      message: "Book returned successfully",
      fine
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });
  }
};



// Get Borrow Records
const getBorrowRecords = async (req, res) => {

  try {

    const records = await Borrow.find()
      .populate("user", "name email")
      .populate("book", "title author");

    res.json(records);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });
  }
};


module.exports = {
  borrowBook,
  returnBook,
  getBorrowRecords
};