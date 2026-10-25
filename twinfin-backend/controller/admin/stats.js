const Customer = require("../../models/customer");
const Transaction = require("../../models/transaction");
const Goal = require("../../models/goal");
const Category = require("../../models/category");

// Platform-wide numbers for the admin dashboard
exports.getStats = async (req, res) => {
    const [customers, transactions, goals, categories, volume] = await Promise.all([
        Customer.countDocuments(),
        Transaction.countDocuments(),
        Goal.countDocuments(),
        Category.countDocuments(),
        Transaction.aggregate([{ $group: { _id: null, total: { $sum: { $abs: "$amount" } } } }]),
    ]);
    res.json({ customers, transactions, goals, categories, volume: volume[0]?.total || 0 });
};
