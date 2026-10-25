const mongoose = require("mongoose");
const Transaction = require("../../models/transaction");
const Budget = require("../../models/budget");
const Goal = require("../../models/goal");

// GET /dashboard?month=YYYY-MM
// Summary, category split, budget status, 6-month trend and the "digital twin"
// projection of the customer's balance for the next 12 months.
exports.getDashboard = async (req, res) => {
    try {
        const customer = new mongoose.Types.ObjectId(req.customer.id);
        const now = new Date();
        const [y, m] = (req.query.month || `${now.getFullYear()}-${now.getMonth() + 1}`).split("-").map(Number);
        const from = new Date(y, m - 1, 1);
        const to = new Date(y, m, 1);

        const monthTx = await Transaction.find({ customer, date: { $gte: from, $lt: to } }).sort({ date: -1 });
        const income = monthTx.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0);
        const expenses = monthTx.filter((t) => t.amount < 0).reduce((s, t) => s - t.amount, 0);

        const spentBy = {};
        monthTx.filter((t) => t.amount < 0).forEach((t) => { spentBy[t.category] = (spentBy[t.category] || 0) - t.amount; });
        const byCategory = Object.entries(spentBy).map(([category, spent]) => ({ category, spent })).sort((a, b) => b.spent - a.spent);

        const budgets = await Budget.find({ customer });
        const budgetStatus = budgets.map((b) => ({ id: b._id, category: b.category, budget: b.amount, spent: spentBy[b.category] || 0 }));

        // Last 6 months of income vs expenses
        const trendFrom = new Date(y, m - 6, 1);
        const trendAgg = await Transaction.aggregate([
            { $match: { customer, date: { $gte: trendFrom, $lt: to } } },
            { $group: {
                _id: { y: { $year: "$date" }, m: { $month: "$date" } },
                income: { $sum: { $cond: [{ $gt: ["$amount", 0] }, "$amount", 0] } },
                expenses: { $sum: { $cond: [{ $lt: ["$amount", 0] }, { $abs: "$amount" }, 0] } },
            } },
        ]);
        const trend = [];
        for (let i = 5; i >= 0; i--) {
            const d = new Date(y, m - 1 - i, 1);
            const row = trendAgg.find((r) => r._id.y === d.getFullYear() && r._id.m === d.getMonth() + 1) || {};
            trend.push({ month: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`, income: row.income || 0, expenses: row.expenses || 0 });
        }

        // Digital twin: project balance forward from the 6-month average net
        const [{ balance = 0 } = {}] = await Transaction.aggregate([
            { $match: { customer } }, { $group: { _id: null, balance: { $sum: "$amount" } } },
        ]);
        const avgNet = trend.reduce((s, t) => s + t.income - t.expenses, 0) / trend.length;
        const projection = Array.from({ length: 12 }, (_, i) => ({ month: i + 1, balance: Math.round(balance + avgNet * (i + 1)) }));

        const goals = await Goal.find({ customer }).sort({ due: 1 });
        const savingsRate = income > 0 ? Math.round(((income - expenses) / income) * 100) : 0;
        const overBudget = budgetStatus.filter((b) => b.spent > b.budget).length;
        const healthScore = Math.max(0, Math.min(100, Math.round(50 + savingsRate - overBudget * 8)));

        res.json({
            period: `${y}-${String(m).padStart(2, "0")}`,
            summary: { income, expenses, net: income - expenses, savingsRate, balance, healthScore },
            byCategory, budgetStatus, trend, projection, goals,
            recent: monthTx.slice(0, 5),
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
