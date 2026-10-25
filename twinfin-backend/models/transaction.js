const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true, index: true },
    description: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    account: { type: String, default: "Checking", trim: true },
    // negative = money out, positive = money in
    amount: { type: Number, required: true },
    date: { type: Date, required: true },
}, { timestamps: true });

module.exports = mongoose.model("Transaction", transactionSchema);
