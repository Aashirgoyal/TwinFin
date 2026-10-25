const User = require("../../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "secretKey";

// ADMIN LOGIN
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: "Email and Password are required" });
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        const token = jwt.sign({ id: user._id, email: user.email, role: "admin" }, JWT_SECRET, { expiresIn: "8h" });
        res.json({ message: "Login Successful", token, user: { name: user.name, email: user.email } });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
};
