const Reservation = require("../models/Reservation");
const Book = require("../models/Book");


// Reserve Book
const reserveBook = async (req, res) => {

  try {

    const { userId, bookId } = req.body;

    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({
        message: "Book not found"
      });
    }

    const reservation = await Reservation.create({
      user: userId,
      book: bookId
    });

    res.status(201).json({
      message: "Book reserved successfully",
      reservation
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });
  }
};


// Get Reservations
const getReservations = async (req, res) => {

  try {

    const reservations = await Reservation.find()
      .populate("user", "name email")
      .populate("book", "title author");

    res.json(reservations);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });
  }
};


module.exports = {
  reserveBook,
  getReservations
};