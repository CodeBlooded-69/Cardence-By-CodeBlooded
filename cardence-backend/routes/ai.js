const express = require('express');
const axios = require('axios');
const auth = require('../middleware/auth');
const Card = require('../models/Card');

const router = express.Router();

router.post('/ask', auth, async (req, res) => {
  const { message } = req.body;
  
  if (!message || !message.trim()) {
    return res.status(400).json({ message: "Please enter a question." });
  }

  const user = req.user;

  try {
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/facebook/blenderbot-1B-distill',
      { 
        inputs: message
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.HUGGINGFACE_TOKEN}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    );

    console.log('Hugging Face Response:', response.data);

    let aiReply = "Sorry, I couldn't process that request.";
    
    if (response.data && Array.isArray(response.data) && response.data.length > 0) {
      if (response.data[0].generated_text) {
        aiReply = response.data[0].generated_text;
      }
    }

    // Add personalized greeting
    if (aiReply.length < 15) {
      aiReply = `Hi ${user.name}! I'm CardenceAI. Ask me about credit cards, budgeting, or financial tips!`;
    }

    res.json({ reply: aiReply });

  } catch (error) {
    console.error('Hugging Face AI error:', error.response?.data || error.message);
    
    // Friendly fallback
    const fallback = `Hi ${user.name}! I'm CardenceAI. I can help with your finances. Try asking about saving money or credit card tips!`;
    res.json({ reply: fallback });
  }
});

module.exports = router;
