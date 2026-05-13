const Book = require("../models/Book");


// ADD BOOK
const addBook = async (req, res) => {

  try {

    const {
      title,
      author,
      isbn,
      genre,
      publicationYear,
      quantity
    } = req.body;

    const newBook = new Book({
      title,
      author,
      isbn,
      genre,
      publicationYear,
      quantity: quantity || 1,

      // ALWAYS AVAILABLE WHEN ADDED
      available: true
    });

    const savedBook = await newBook.save();

    res.status(201).json(savedBook);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};


// GET ALL BOOKS
const getBooks = async (req, res) => {

  try {

    const books = await Book.find();

    res.json(books);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};


// GET SINGLE BOOK
const getBookById = async (req, res) => {

  try {

    const book = await Book.findById(req.params.id);

    if (!book) {

      return res.status(404).json({
        message: "Book not found"
      });

    }

    res.json(book);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};


// UPDATE BOOK
const updateBook = async (req, res) => {

  try {

    const book = await Book.findById(req.params.id);

    if (!book) {

      return res.status(404).json({
        message: "Book not found"
      });

    }

    book.title = req.body.title || book.title;
    book.author = req.body.author || book.author;
    book.isbn = req.body.isbn || book.isbn;
    book.genre = req.body.genre || book.genre;
    book.publicationYear =
      req.body.publicationYear || book.publicationYear;

    book.quantity =
      req.body.quantity || book.quantity;

    book.image =
      req.body.image || book.image;

    // AVAILABLE ONLY IF QUANTITY > 0
    book.available = book.quantity > 0;

    const updatedBook = await book.save();

    res.json(updatedBook);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};


// DELETE BOOK
const deleteBook = async (req, res) => {

  try {

    const book = await Book.findById(req.params.id);

    if (!book) {

      return res.status(404).json({
        message: "Book not found"
      });

    }

    await book.deleteOne();

    res.json({
      message: "Book removed"
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};


module.exports = {
  addBook,
  getBooks,
  getBookById,
  updateBook,
  deleteBook
};