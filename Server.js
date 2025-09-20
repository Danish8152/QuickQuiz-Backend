import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/mongodb.js";
import authRoutes from "./routes/auth.js";

dotenv.config();

const app = express();

// ✅ Enable JSON parsing for POST requests
app.use(express.json());

// ✅ Enable CORS for your frontend (local + deployed)
const allowedOrigins = [
  process.env.FRONTEND_URL,          // local or deployed frontend URL
  "http://localhost:5173"            // optional: allow local dev explicitly
];

app.use(cors({
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// ✅ Routes
app.use("/api/auth", authRoutes);

// ✅ Connect to MongoDB
connectDB();

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Backend listening on port ${PORT}`);
});
