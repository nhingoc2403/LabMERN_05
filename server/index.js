// ================= CONFIG =================
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");

const app = express();

// ================= DATABASE =================
// Kết nối MongoDB (loại bỏ useNewUrlParser và useUnifiedTopology đã deprecated)
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ================= MIDDLEWARE =================
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ================= API =================
app.use("/api/customer", require("./api/customer"));
app.use("/api/admin", require("./api/admin"));

// ================= ADMIN BUILD =================
app.use(
  "/admin",
  express.static(path.resolve(__dirname, "../client-admin/build"))
);

app.get("/admin/*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../client-admin/build", "index.html"));
});

// ================= CUSTOMER BUILD =================
app.use(
  "/",
  express.static(path.resolve(__dirname, "../client-customer/build"))
);

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../client-customer/build", "index.html"));
});

// ================= RUN SERVER =================
// Replit yêu cầu listen 0.0.0.0 và dùng process.env.PORT
const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🔥 Server running on port ${PORT}`);
});