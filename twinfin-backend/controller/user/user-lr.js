const Customer = require("../../models/customer");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "secretKey";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d";

const publicCustomer = (c) => ({
    id: c._id, name: c.name, email: c.email, phone: c.phone,
    currency: c.currency, monthlyIncome: c.monthlyIncome,
});

// CUSTOMER REGISTER
exports.register = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;
        if (!name || !email || !password) return res.status(400).json({ message: "All fields are required" });
        if (password.length < 6) return res.status(400).json({ message: "Password must be at least 6 characters" });
        if (await Customer.findOne({ email: email.toLowerCase() })) return res.status(409).json({ message: "Customer already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        await Customer.create({ name, email, password: hashedPassword, phone });
        res.status(201).json({ message: "Registration successful" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// CUSTOMER LOGIN
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: "Email and Password are required" });

        const customer = await Customer.findOne({ email: email.toLowerCase() });
        if (!customer || !(await bcrypt.compare(password, customer.password))) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        if (!customer.isActive) return res.status(403).json({ message: "Account disabled" });

        const token = jwt.sign({ id: customer._id, email: customer.email, role: "customer" }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
        res.json({ message: "Login Successful", token, customer: publicCustomer(customer) });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// GET / UPDATE PROFILE
exports.getProfile = async (req, res) => {
    const customer = await Customer.findById(req.customer.id);
    if (!customer) return res.status(404).json({ message: "Customer not found" });
    res.json(publicCustomer(customer));
};

exports.updateProfile = async (req, res) => {
    try {
        const { name, phone, currency, monthlyIncome } = req.body;
        const customer = await Customer.findByIdAndUpdate(
            req.customer.id,
            { name, phone, currency, monthlyIncome },
            { new: true, runValidators: true }
        );
        res.json(publicCustomer(customer));
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
