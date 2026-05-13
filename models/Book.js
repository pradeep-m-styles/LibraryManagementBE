const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },

    author: {
      type: String,
      required: true
    },

    isbn: {
      type: String,
      required: true
    },

    genre: {
      type: String
    },

    publicationYear: {
      type: Number
    },

    quantity: {
      type: Number,
      default: 1
    },

    available: {
      type: Boolean,
      default: true
    },

    image: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Book", bookSchema);