const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const UserRoutes = require('./Routes/UserRoutes');
const PostRoutes = require('./Routes/PostRoutes');
const FeedbackRoutes = require('./Routes/FeedbackRoutes');

dotenv.config();
const app = express();


app.use(cors({
  origin: ['http://localhost:5174','https://feedback-board-git-main-rithdeshs-projects-a2fe6ed7.vercel.app','https://feedback-board-9vt8qgrkx-rithdeshs-projects-a2fe6ed7.vercel.app','https://feedback-board-sable.vercel.app'],
  credentials:true
}));
app.use(express.json()); 

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));


app.get("/", (req, res) => {
  res.send("Feedback Board API is running...");
});

//Routes
app.use("/User", UserRoutes);
app.use("/Post", PostRoutes);
app.use("/Feedback", FeedbackRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
