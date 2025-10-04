const mongoose = require('mongoose');
const CardSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  cardType: { type: String, required: true },        // visa, mastercard etc.
  cardNo: { type: String, required: true },           // Store as string (masked or full)
  expiry: { type: String, required: true },           // MM/YY
  holder: { type: String, required: true },
  limit: { type: Number, required: true },
  balance: { type: Number, default: 0 },              // Optional: track card spend
  logo: { type: String },                             // Card logo url
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.models.Card || mongoose.model('Card', CardSchema);
