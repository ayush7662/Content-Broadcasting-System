require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { sequelize } = require("./src/models");
const { errorHandler } = require("./src/middlewares/error.middleware");

const authRoutes = require("./src/routes/auth.routes");
const contentRoutes = require("./src/routes/content.routes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use("/uploads", express.static("src/uploads"));

// Health check
app.get("/", (req, res) => {
  res.json({ msg: "Content Broadcasting System API is running" });
});

// Routes
app.use("/auth", authRoutes);
app.use("/content", contentRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ msg: "Route not found" });
});

// Global error handler
app.use(errorHandler);

// DB + Server Start
sequelize
  .authenticate()
  .then(() => {
    console.log("MySQL Connected");
    return sequelize.sync({ alter: true });
  })
  .then(() => {
    console.log("Models synced");
    app.listen(process.env.PORT || 3000, () => {
      console.log("Server running on port", process.env.PORT || 3000);
    });
  })
  .catch((err) => {
    console.error("DB Connection Error:", err.message);
    process.exit(1);
  });

