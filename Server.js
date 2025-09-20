import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/mongodb.js";
import authRoutes from "./routes/auth.js";

dotenv.config();

const app = express();

// ✅ Add this line so req.body works
app.use(express.json());

app.use("/api/auth", authRoutes);

connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Backend listening on port ${PORT}`);
});
