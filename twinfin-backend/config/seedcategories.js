const Category = require("../models/category");

const DEFAULTS = [
    { name: "Income", type: "income", color: "#16a34a" },
    { name: "Housing", type: "expense", color: "#2563eb" },
    { name: "Food", type: "expense", color: "#f97316" },
    { name: "Transport", type: "expense", color: "#8b5cf6" },
    { name: "Utilities", type: "expense", color: "#0891b2" },
    { name: "Health", type: "expense", color: "#dc2626" },
    { name: "Entertainment", type: "expense", color: "#db2777" },
    { name: "Shopping", type: "expense", color: "#ca8a04" },
    { name: "Other", type: "expense", color: "#64748b" },
];

// Seeds the default finance categories when the collection is empty
const seedCategories = async () => {
    if (await Category.countDocuments()) return;
    await Category.insertMany(DEFAULTS);
    console.log("categories seeded");
};
module.exports = seedCategories;
module.exports.DEFAULTS = DEFAULTS;
