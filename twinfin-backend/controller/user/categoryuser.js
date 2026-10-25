const Category = require("../../models/category");

// Active categories, for the customer's forms and filters
exports.getActiveCategories = async (req, res) => {
    const categories = await Category.find({ isActive: true }).sort({ type: -1, name: 1 });
    res.json(categories);
};
