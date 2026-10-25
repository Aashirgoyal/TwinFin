const mongoose = require("mongoose");

// Monthly spending limit per category, per customer
const budgetSchema = new mongoose.Schema({
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
    category: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 0 },
}, { timestamps: true });

budgetSchema.index({ customer: 1, category: 1 }, { unique: true });

module.exports = mongoose.model("Budget", budgetSchema);
