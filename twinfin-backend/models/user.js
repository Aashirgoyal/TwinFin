const mongoose = require("mongoose");

// Admin users
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, default: "admin" },
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
