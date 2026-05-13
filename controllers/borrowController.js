const Borrow = require("../models/Borrow");
const Book = require("../models/Book");

// BORROW BOOK
exports.borrowBook = async (req, res) => {
  try {
    const { userId, bookId } = req.body;

    // prevent duplicate borrow
    const existing = await Borrow.findOne({
      userId,
      bookId,
      returned: false
    });

    if (existing) {
      return res.status(400).json({ message: "Already borrowed this book" });
    }

    const book = await Book.findById(bookId);

    if (!book || book.quantity <= 0) {
      return res.status(400).json({ message: "Book not available" });
    }

    book.quantity -= 1;
    book.available = book.quantity > 0;
    await book.save();

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7);

    const borrow = await Borrow.create({
      userId,
      bookId,
      borrowDate: new Date(),
      dueDate,
      returned: false,
      fine: 0
    });

    res.status(201).json(borrow);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// RETURN BOOK
exports.returnBook = async (req, res) => {
  try {
    const { borrowId } = req.body;

    const borrow = await Borrow.findById(borrowId);

    if (!borrow) {
      return res.status(404).json({ message: "Borrow record not found" });
    }

    const book = await Book.findById(borrow.bookId);

    borrow.returned = true;
    borrow.returnDate = new Date();

    const diffDays = Math.ceil(
      (new Date() - new Date(borrow.dueDate)) / (1000 * 60 * 60 * 24)
    );

    borrow.fine = diffDays > 0 ? diffDays * 10 : 0;

    await borrow.save();

    book.quantity += 1;
    book.available = true;
    await book.save();

    res.json({
      message: "Book returned successfully",
      fine: borrow.fine
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};