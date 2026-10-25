// Run: npm run seed
// Creates a demo customer (demo@twinfin.com / demo123) with sample data.
require('dotenv').config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const connectDB = require("./db");
const seedAdmin = require("./seedadmin");
const seedCategories = require("./seedcategories");
const Customer = require("../models/customer");
const Transaction = require("../models/transaction");
const Budget = require("../models/budget");
const Goal = require("../models/goal");

const run = async () => {
    await connectDB();
    await seedAdmin();
    await seedCategories();

    await Customer.deleteOne({ email: "demo@twinfin.com" });
    const customer = await Customer.create({
        name: "Demo User",
        email: "demo@twinfin.com",
        password: await bcrypt.hash("demo123", 10),
        phone: "9999999999",
    });
    const owner = customer._id;
    await Promise.all([
        Transaction.deleteMany({ customer: owner }),
        Budget.deleteMany({ customer: owner }),
        Goal.deleteMany({ customer: owner }),
    ]);

    const now = new Date();
    const day = (monthsAgo, d) => new Date(now.getFullYear(), now.getMonth() - monthsAgo, d);
    const tx = [];
    for (let m = 0; m < 6; m++) {
        tx.push(
            { description: "Salary", category: "Income", amount: 5200, date: day(m, 1), account: "Checking" },
            { description: "Rent", category: "Housing", amount: -1450, date: day(m, 2), account: "Checking" },
            { description: "Groceries", category: "Food", amount: -(380 + m * 15), date: day(m, 6), account: "Credit Card" },
            { description: "Restaurants", category: "Food", amount: -(140 + m * 10), date: day(m, 14), account: "Credit Card" },
            { description: "Metro pass", category: "Transport", amount: -110, date: day(m, 3), account: "Checking" },
            { description: "Electricity & internet", category: "Utilities", amount: -(210 + m * 5), date: day(m, 10), account: "Checking" },
            { description: "Gym", category: "Health", amount: -60, date: day(m, 5), account: "Credit Card" },
            { description: "Streaming", category: "Entertainment", amount: -35, date: day(m, 12), account: "Credit Card" },
            { description: "Clothes", category: "Shopping", amount: -(90 + m * 20), date: day(m, 20), account: "Credit Card" }
        );
        if (m % 2 === 0) tx.push({ description: "Freelance project", category: "Income", amount: 800, date: day(m, 18), account: "Savings" });
    }
    await Transaction.insertMany(tx.map((t) => ({ ...t, customer: owner })));

    await Budget.insertMany([
        ["Housing", 1450], ["Food", 600], ["Transport", 150], ["Utilities", 260],
        ["Health", 120], ["Entertainment", 60], ["Shopping", 150],
    ].map(([category, amount]) => ({ customer: owner, category, amount })));

    const y = now.getFullYear();
    await Goal.insertMany([
        { title: "Emergency Fund", saved: 4200, target: 10000, monthly: 500, due: `${y + 1}-06` },
        { title: "Vacation to Japan", saved: 1800, target: 4500, monthly: 300, due: `${y + 1}-03` },
        { title: "New Laptop", saved: 900, target: 1600, monthly: 150, due: `${y}-12` },
    ].map((g) => ({ ...g, customer: owner })));

    console.log("demo data seeded: demo@twinfin.com / demo123");
    await mongoose.disconnect();
};
run();
