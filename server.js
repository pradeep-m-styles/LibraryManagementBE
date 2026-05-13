const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const connectDB = require("./config/db");
const dashboardRoutes = require("./routes/dashboardRoutes");
dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());


// Routes
app.use("/api/auth", require("./routes/authRoutes"));

app.use("/api/books", require("./routes/bookRoutes"));

app.use("/api/borrow", require("./routes/borrowRoutes"));

app.use("/api/reviews", require("./routes/reviewRoutes"));

app.use(
  "/api/reservations",
  require("./routes/reservationRoutes")
);
app.use("/api/payments", require("./routes/paymentRoutes"));


app.use("/api/dashboard", dashboardRoutes);

// Home Route
app.get("/", (req, res) => {
  res.send("Library Management API Running");
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});