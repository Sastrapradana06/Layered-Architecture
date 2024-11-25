const express = require("express");
const app = express();
const cors = require("cors");
const productController = require("./product/product.controller");
const authController = require("./auth/auth.controller");

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// GET /
app.get("/", (req, res) => {
  res.send("Hello from express");
});

app.use("/products", productController);
app.use("/auth", authController);

// Start server
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});

process.on("SIGTERM", () => {
  server.close(() => {
    console.log("Process terminated, server closed.");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  server.close(() => {
    console.log("Process interrupted, server closed.");
    process.exit(0);
  });
});
