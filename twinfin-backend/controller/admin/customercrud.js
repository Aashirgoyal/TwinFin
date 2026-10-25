const Customer = require("../../models/customer");
const Transaction = require("../../models/transaction");
const Budget = require("../../models/budget");
const Goal = require("../../models/goal");

exports.getCustomers = async (req, res) => {
    const customers = await Customer.find().select("-password").sort({ createdAt: -1 }).lean();
    const counts = await Transaction.aggregate([{ $group: { _id: "$customer", n: { $sum: 1 } } }]);
    const byId = Object.fromEntries(counts.map((c) => [String(c._id), c.n]));
    res.json(customers.map((c) => ({ ...c, transactions: byId[String(c._id)] || 0 })));
};

// Enable / disable a customer account
exports.toggleCustomer = async (req, res) => {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ message: "Customer not found" });
    customer.isActive = !customer.isActive;
    await customer.save();
    res.json({ id: customer._id, isActive: customer.isActive });
};

// Delete a customer and all their finance data
exports.deleteCustomer = async (req, res) => {
    const id = req.params.id;
    await Promise.all([
        Customer.findByIdAndDelete(id),
        Transaction.deleteMany({ customer: id }),
        Budget.deleteMany({ customer: id }),
        Goal.deleteMany({ customer: id }),
    ]);
    res.json({ message: "Deleted" });
};
