const mongoose = require("mongoose");

// Finance categories, managed by the admin and used by every customer
const categorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true, trim: true },
    type: { type: String, enum: ["income", "expense"], default: "expense" },
    color: { type: String, default: "#64748b" },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model("Category", categorySchema);
