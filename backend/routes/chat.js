const express = require('express');
const router = express.Router();
const Chat = require('../models/Chat');
const Product = require('../models/Product');
const auth = require('../middleware/auth');

// Get all chats for a user (as buyer or seller)
router.get('/my-chats', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const chats = await Chat.find({
      $or: [{ buyerId: userId }, { sellerId: userId }]
    })
    .populate('productId', 'name images price')
    .populate('buyerId', 'name email')
    .populate('sellerId', 'name email')
    .populate('messages.senderId', 'name')
    .sort({ lastMessageAt: -1 });

    res.json({
      success: true,
      data: chats
    });
  } catch (error) {
    console.error('Error fetching chats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch chats'
    });
  }
});

// Get specific chat by ID
router.get('/:chatId', auth, async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user.id;

    const chat = await Chat.findOne({
      _id: chatId,
      $or: [{ buyerId: userId }, { sellerId: userId }]
    })
    .populate('productId', 'name images price')
    .populate('buyerId', 'name email')
    .populate('sellerId', 'name email')
    .populate('messages.senderId', 'name');

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    res.json({
      success: true,
      data: chat
    });
  } catch (error) {
    console.error('Error fetching chat:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch chat'
    });
  }
});

// Start a new chat or get existing chat for a product
router.post('/start-chat', auth, async (req, res) => {
  try {
    const { productId, message } = req.body;
    const buyerId = req.user.id;

    if (!productId || !message) {
      return res.status(400).json({
        success: false,
        message: 'Product ID and message are required'
      });
    }

    // Get product to find seller
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if user is trying to chat with their own product
    if (product.seller.toString() === buyerId) {
      return res.status(400).json({
        success: false,
        message: 'You cannot chat with your own product'
      });
    }

    // Check if chat already exists
    let chat = await Chat.findOne({
      productId,
      buyerId,
      sellerId: product.seller
    });

    if (!chat) {
      // Create new chat
      chat = new Chat({
        productId,
        buyerId,
        sellerId: product.seller,
        messages: [{
          senderId: buyerId,
          message: message
        }]
      });
    } else {
      // Add message to existing chat
      chat.messages.push({
        senderId: buyerId,
        message: message
      });
      chat.lastMessageAt = new Date();
    }

    await chat.save();

    // Populate chat data
    await chat.populate('productId', 'name images price');
    await chat.populate('buyerId', 'name email');
    await chat.populate('sellerId', 'name email');
    await chat.populate('messages.senderId', 'name');

    res.json({
      success: true,
      data: chat,
      message: chat.messages.length === 1 ? 'Chat started successfully' : 'Message sent successfully'
    });
  } catch (error) {
    console.error('Error starting chat:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to start chat'
    });
  }
});

// Send message in existing chat
router.post('/:chatId/send-message', auth, async (req, res) => {
  try {
    const { chatId } = req.params;
    const { message } = req.body;
    const senderId = req.user.id;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Message is required'
      });
    }

    const chat = await Chat.findOne({
      _id: chatId,
      $or: [{ buyerId: senderId }, { sellerId: senderId }]
    });

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    // Add message
    chat.messages.push({
      senderId,
      message: message.trim()
    });
    chat.lastMessageAt = new Date();

    await chat.save();

    // Populate chat data
    await chat.populate('productId', 'name images price');
    await chat.populate('buyerId', 'name email');
    await chat.populate('sellerId', 'name email');
    await chat.populate('messages.senderId', 'name');

    res.json({
      success: true,
      data: chat,
      message: 'Message sent successfully'
    });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message'
    });
  }
});

// Mark messages as read
router.put('/:chatId/mark-read', auth, async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user.id;

    const chat = await Chat.findOne({
      _id: chatId,
      $or: [{ buyerId: userId }, { sellerId: userId }]
    });

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    // Mark all messages from other user as read
    chat.messages.forEach(msg => {
      if (msg.senderId.toString() !== userId) {
        msg.isRead = true;
      }
    });

    await chat.save();

    res.json({
      success: true,
      message: 'Messages marked as read'
    });
  } catch (error) {
    console.error('Error marking messages as read:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark messages as read'
    });
  }
});

// Close chat
router.put('/:chatId/close', auth, async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user.id;

    const chat = await Chat.findOne({
      _id: chatId,
      $or: [{ buyerId: userId }, { sellerId: userId }]
    });

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    chat.status = 'closed';
    await chat.save();

    res.json({
      success: true,
      message: 'Chat closed successfully'
    });
  } catch (error) {
    console.error('Error closing chat:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to close chat'
    });
  }
});

module.exports = router; 