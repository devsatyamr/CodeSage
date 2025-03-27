const express = require("express");
const { handleChat } = require("../controllers/chatController");

const router = express.Router();

router.post("/", handleChat); // ✅ Fix: Remove "/chat" from here

module.exports = router;
