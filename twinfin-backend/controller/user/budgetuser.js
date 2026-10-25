const Budget = require("../../models/budget");

exports.getBudgets = async (req, res) => {
    res.json(await Budget.find({ customer: req.customer.id }).sort({ category: 1 }));
};

// Create or update the budget for one category
exports.saveBudget = async (req, res) => {
    try {
        const { category, amount } = req.body;
        if (!category || amount === undefined) return res.status(400).json({ message: "Category and amount are required" });
        const budget = await Budget.findOneAndUpdate(
            { customer: req.customer.id, category },
            { amount },
            { new: true, upsert: true, runValidators: true }
        );
        res.json(budget);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteBudget = async (req, res) => {
    await Budget.findOneAndDelete({ _id: req.params.id, customer: req.customer.id });
    res.json({ message: "Deleted" });
};
