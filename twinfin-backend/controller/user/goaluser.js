const Goal = require("../../models/goal");

exports.getGoals = async (req, res) => {
    res.json(await Goal.find({ customer: req.customer.id }).sort({ due: 1 }));
};

exports.createGoal = async (req, res) => {
    try {
        const { title, saved, target, monthly, due } = req.body;
        res.status(201).json(await Goal.create({ customer: req.customer.id, title, saved, target, monthly, due }));
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.updateGoal = async (req, res) => {
    try {
        const { title, saved, target, monthly, due } = req.body;
        const goal = await Goal.findOneAndUpdate(
            { _id: req.params.id, customer: req.customer.id },
            { title, saved, target, monthly, due },
            { new: true, runValidators: true }
        );
        if (!goal) return res.status(404).json({ message: "Goal not found" });
        res.json(goal);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteGoal = async (req, res) => {
    await Goal.findOneAndDelete({ _id: req.params.id, customer: req.customer.id });
    res.json({ message: "Deleted" });
};
