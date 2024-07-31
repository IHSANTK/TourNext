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

    // console.log(messages);

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



router.get('/chats/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
  
     console.log('userid',userId);
      const chats = await Message.aggregate([
        {
          $match: {
            $or: [
              { senderId: userId },
              { receiverId: userId }
            ]
          }
        },
        {
          $group: {
            _id: {
              $cond: [
                { $gte: ["$senderId", "$receiverId"] },
                { senderId: "$senderId", receiverId: "$receiverId" },
                { senderId: "$receiverId", receiverId: "$senderId" }
              ]
            },
            latestMessage: { $last: "$$ROOT" }
          }
        },
        {
          $lookup: {
            from: "users", 
            localField: "_id.receiverId",
            foreignField: "_id",
            as: "receiver"
          }
        },
        {
          $unwind: "$receiver"
        }
      ]);

console.log('exact user chats',chats);
  
      res.json(chats);
    } catch (error) {
      console.error('Error fetching chats:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  

module.exports = router;