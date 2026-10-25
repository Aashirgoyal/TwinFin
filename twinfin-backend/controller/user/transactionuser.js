const Transaction = require("../../models/transaction");

// GET /transactions?month=YYYY-MM&category=Food&q=text
exports.getTransactions = async (req, res) => {
    const filter = { customer: req.customer.id };
    const { month, category, q } = req.query;
    if (month) {
        const [y, m] = month.split("-").map(Number);
        filter.date = { $gte: new Date(y, m - 1, 1), $lt: new Date(y, m, 1) };
    }
    if (category) filter.category = category;
    if (q) filter.description = { $regex: q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), $options: "i" };
    res.json(await Transaction.find(filter).sort({ date: -1 }));
};

exports.createTransaction = async (req, res) => {
    try {
        const { description, category, account, amount, date } = req.body;
        const tx = await Transaction.create({ customer: req.customer.id, description, category, account, amount, date });
        res.status(201).json(tx);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.updateTransaction = async (req, res) => {
    try {
        const { description, category, account, amount, date } = req.body;
        const tx = await Transaction.findOneAndUpdate(
            { _id: req.params.id, customer: req.customer.id },
            { description, category, account, amount, date },
            { new: true, runValidators: true }
        );
        if (!tx) return res.status(404).json({ message: "Transaction not found" });
        res.json(tx);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteTransaction = async (req, res) => {
    const tx = await Transaction.findOneAndDelete({ _id: req.params.id, customer: req.customer.id });
    if (!tx) return res.status(404).json({ message: "Transaction not found" });
    res.json({ message: "Deleted" });
};
