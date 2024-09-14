const express = require("express");
const Text = require("../models/Text");
const router = express.Router();

// Get the latest text for a specific user
router.get("/", async (req, res) => {
    const userId = req.query.userId || "admin"; // Default to 'admin' if userId is not provided
    try {
        const text = await Text.findOne({ userId }).sort({ _id: -1 }); // Find the latest text for the user
        res.json(text ? text.content : { content: "No text found for userId: " + userId });
    } catch (error) {
        res.status(500).json({ error: "Error fetching data" });
    }
});

// Update or create text for a specific user
router.put("/", async (req, res) => {
    const { content } = req.body;

    const userId = req.body.userId || "admin"; // Default to 'admin' if userId is not provided

    try {
        // Find the text entry for the given userId
        let text = await Text.findOne({ userId });

        if (text) {
            // If it exists, update the content
            text.content = content;
            await text.save();
            res.json({ message: `Text updated successfully for userId: ${userId}` });
        } else {
            // If no entry exists, create a new one with the provided userId (or default 'admin')
            const newText = new Text({ content, userId });
            await newText.save();
            res.json({ message: `Text created successfully for userId: ${userId}` });
        }
    } catch (error) {
        res.status(500).json({ error: "Error updating data" });
    }
});

module.exports = router;
