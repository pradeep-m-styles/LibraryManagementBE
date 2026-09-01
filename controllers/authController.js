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

    const bookQuantity = quantity !== undefined ? quantity : 1;

    const newBook = new Book({
      title,
      author,
      isbn,
      genre,
      publicationYear,
      quantity: bookQuantity,

      // Available only when quantity is greater than 0
      available: bookQuantity > 0
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

    // Allow quantity = 0
    if (req.body.quantity !== undefined) {
      book.quantity = req.body.quantity;
    }

    if (req.body.image !== undefined) {
      book.image = req.body.image;
    }

    // Available only when quantity > 0
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
```
