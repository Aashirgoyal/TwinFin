const Category = require("../../models/category");

exports.getCategories = async (req, res) => {
    res.json(await Category.find().sort({ type: -1, name: 1 }));
};

exports.getCategory = async (req, res) => {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });
    res.json(category);
};

exports.createCategory = async (req, res) => {
    try {
        const { name, type, color, isActive } = req.body;
        res.status(201).json(await Category.create({ name, type, color, isActive }));
    } catch (error) {
        res.status(400).json({ message: error.code === 11000 ? "Category already exists" : error.message });
    }
};

exports.updateCategory = async (req, res) => {
    try {
        const { name, type, color, isActive } = req.body;
        const category = await Category.findByIdAndUpdate(req.params.id, { name, type, color, isActive }, { new: true, runValidators: true });
        if (!category) return res.status(404).json({ message: "Category not found" });
        res.json(category);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteCategory = async (req, res) => {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
};
