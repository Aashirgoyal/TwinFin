const mongoose = require("mongoose");

const goalSchema = new mongoose.Schema({
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true, index: true },
    title: { type: String, required: true, trim: true },
    saved: { type: Number, default: 0, min: 0 },
    target: { type: Number, required: true, min: 1 },
    monthly: { type: Number, default: 0, min: 0 },
    // target month, "YYYY-MM"
    due: { type: String, required: true, match: /^\d{4}-(0[1-9]|1[0-2])$/ },
}, { timestamps: true, toJSON: { virtuals: true } });

goalSchema.virtual("progress").get(function () {
    return this.target > 0 ? Math.min(100, Math.round((this.saved / this.target) * 100)) : 0;
});

module.exports = mongoose.model("Goal", goalSchema);
