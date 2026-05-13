const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ✅ JSON middleware
app.use(express.json());

// ✅ CORS FIX (IMPORTANT)
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://your-netlify-site.netlify.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// ✅ Handle preflight requests
app.options("*", cors());

// (YOUR ROUTES)
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/books", require("./routes/bookRoutes"));
app.use("/api/borrow", require("./routes/borrowRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes"));
app.use("/api/reservations", require("./routes/reservationRoutes"));

// ✅ SERVER START
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});