const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Assuming there is a User model with ObjectId references
        required: true
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Assuming there is a User model with ObjectId references
        required: true
    },
    message: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    readStatus: {
        type: Boolean,
        default: false
    },
    messageType: {
        type: String,
        enum: ['text', 'image', 'video', 'audio'], // Example message types, adjust as needed
        default: 'text'
    }
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
