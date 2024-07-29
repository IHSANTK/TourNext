const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

router.get('/messages/:senderId/:receiverId', async (req, res) => {
  const { senderId, receiverId } = req.params;
  
  try {
    const messages = await Message.find({
      $or: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId }
      ]
    }).sort({ timestamp: 1 }); 

    res.json(messages);
  } catch (err) {
    console.error('Error fetching messages:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
