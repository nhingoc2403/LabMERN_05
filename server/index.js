require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

const app = express();

// 🔥 đổi port tại đây
const PORT = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// API
app.use("/api/customer", require("./api/customer"));
app.use("/api/admin", require("./api/admin"));

// ================= ADMIN BUILD =================
app.use(
  "/admin",
  express.static(path.resolve(__dirname, "../client-admin/build"))
);

app.get("/admin/*", (req, res) => {
  res.sendFile(
    path.resolve(__dirname, "../client-admin/build", "index.html")
  );
});

// ================= CUSTOMER BUILD =================
// NEW (Lab 10) - mở lại và bổ sung customer
app.use(
  "/",
  express.static(path.resolve(__dirname, "../client-customer/build"))
);

app.get("*", (req, res) => {
  res.sendFile(
    path.resolve(__dirname, "../client-customer/build", "index.html")
  );
});

// ================= RUN SERVER =================
app.listen(PORT, () => {
  console.log(`🔥 Server running at http://localhost:${PORT}`);
});