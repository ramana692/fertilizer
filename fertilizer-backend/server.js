const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require('path');
const productsRouter = require("./routes/products");
const usersRouter = require("./routes/users");
const ordersRouter = require("./routes/orders");
const reviewsRouter = require("./routes/reviews");
const wishlistRouter = require("./routes/wishlist");
const cartRouter = require("./routes/cart");
const { errorHandler } = require('./middleware/error');

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// File uploads
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// Routes
app.use("/api/products", productsRouter);
app.use("/api/users", usersRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/reviews", reviewsRouter);
app.use("/api/wishlist", wishlistRouter);
app.use("/api/cart", cartRouter);

// Error handling middleware
app.use(errorHandler);

app.get("/", (req, res) => {
  res.send("🌿 Fertilizer Backend is running successfully!");
});

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: 'fertilizer'
    });
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
};

// Start server
const startServer = async () => {
  try {
    await connectDB();
    const PORT = process.env.PORT || 5001;
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Server startup error:', error);
    process.exit(1);
  }
};

startServer();