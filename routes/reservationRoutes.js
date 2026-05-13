const express = require("express");

const router = express.Router();

const {
  reserveBook,
  getReservations
} = require("../controllers/reservationController");


router.post("/", reserveBook);

router.get("/", getReservations);


module.exports = router;