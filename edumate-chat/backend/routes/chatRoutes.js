const express = require('express');
const Chat = require('../models/Chat');  // Import Chat model
const router = express.Router();

// Save chat message
router.post('/', async (req, res) => {
    const { message, sender } = req.body;  // Assuming sender is passed

    try {
        const newChat = new Chat({ message, sender });
        await newChat.save();
        res.status(201).json({ success: true, message: 'Chat saved successfully' });
    } catch (error) {
        console.error('Error saving chat:', error);
        res.status(500).json({ success: false, message: 'Error saving chat' });
    }
});

// Retrieve chat history
router.get('/', async (req, res) => {
    try {
        const chats = await Chat.find().sort({ timestamp: -1 });
        res.status(200).json(chats);
    } catch (error) {
        console.error('Error retrieving chats:', error);
        res.status(500).json({ success: false, message: 'Error retrieving chat history' });
    }
});

module.exports = router;
