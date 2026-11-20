
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const Opportunity = require("./models/Opportunity");
const authRoutes = require("./routes/authRoutes");
const {
  authMiddleware,
  authorizeRole
} = require("./middleware/authMiddleware");

const app = express();

app.use(cors());
app.use(express.json());

// Authentication routes
app.use("/api/auth", authRoutes);
app.get("/api/auth/test-direct", (req, res) => {
  res.json({ message: "Direct route is working!" });
});

// Test authentication route directly
app.get("/api/auth-check", (req, res) => {
  res.json({ message: "Backend authentication check is working!" });
});

// Home route
app.get("/", (req, res) => {
  res.send("CareerConnect backend is running!");
});

// Get opportunities
app.get("/api/opportunities", async (req, res) => {
  try {
    const { search = "", domain = "" } = req.query;
    const filter = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (domain) {
      filter.domain = { $regex: domain, $options: "i" };
    }

    const opportunities = await Opportunity.find(filter).sort({
      createdAt: -1,
    });

    res.json(opportunities);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch opportunities" });
  }
});

// Get one opportunity
app.get("/api/opportunities/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid opportunity ID" });
    }

    const opportunity = await Opportunity.findById(req.params.id);

    if (!opportunity) {
      return res.status(404).json({ message: "Opportunity not found" });
    }

    res.json(opportunity);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch opportunity" });
  }
});

// Create opportunity
app.post(
  "/api/opportunities",
  authMiddleware,
  authorizeRole("recruiter"),
  async (req, res) => {
  try {
    const opportunity = await Opportunity.create(req.body);
    res.status(201).json({
      message: "Opportunity created successfully!",
      opportunity,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      message: "Could not create opportunity",
      error: error.message,
    });
  }
});

// Start server
const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected successfully!");

    app.listen(PORT, () => {
      console.log(`CareerConnect backend running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Backend startup failed:", error.message);
  }
}

startServer();



