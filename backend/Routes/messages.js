const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

// Fetch messages between two users
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
  } catch (error) {
    res.status(500).json({ error: 'Error fetching messages' });
  }
});

router.patch('/messages/:id/read', async (req, res) => {
  const { id } = req.params;

  console.log('messagespatch');

  try {
    const message = await Message.findByIdAndUpdate(id, { readStatus: true }, { new: true });
    res.json(message);
  } catch (error) {
    res.status(500).json({ error: 'Error updating read status' });
  }
});

module.exports = router;