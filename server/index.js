const express = require("express");
const cors = require("cors");
const multer = require("multer");
const bodyParser = require("body-parser");
require("dotenv").config();

const chatRoutes = require("./routes/chat");

const app = express();
const upload = multer();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(upload.none());

app.use("/api/chat", chatRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log("\n🔥 index.js is running...");
    console.log(`✅ Server running on port ${PORT}`);
    console.log("🔗 Gemini API ready\n");
});
