const axios = require("axios");
require("dotenv").config();

const handleChat = async (req, res) => {
    try {
        const message = req.body.message;

        if (!message) {
            return res.status(400).json({ error: "Message is required" });
        }

        console.log(`📨 Received Message: ${message}`);
        console.log("🔄 Fetching response from Gemini API...");

        const API_KEY = process.env.GEMINI_API_KEY;
        const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

        const response = await axios.post(API_URL, {
            contents: [{ parts: [{ text: message }] }]
        }, {
            headers: { "Content-Type": "application/json" }
        });

        console.log("✅ AI Response:", JSON.stringify(response.data, null, 2));

        let text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text 
                   || "No understandable response from AI";

        res.json({ response: text });

    } catch (error) {
        console.error("❌ Gemini API Error:", JSON.stringify(error.response?.data || error.message, null, 2));
        res.status(500).json({ error: "AI processing failed", details: error.response?.data || error.message });
    }
};

module.exports = { handleChat };
