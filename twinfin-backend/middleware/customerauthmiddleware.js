const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "secretKey";

// Protects customer routes: requires a customer token
const customerAuthMiddleware = (req, res, next) => {
    try {
        const header = req.header("Authorization");
        if (!header) return res.status(401).json({ message: "Access Denied. No token provided." });
        const token = header.startsWith("Bearer ") ? header.slice(7) : header;
        const verified = jwt.verify(token, JWT_SECRET);
        if (verified.role !== "customer") return res.status(403).json({ message: "Customer token required." });
        req.customer = verified;
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid or expired token" });
    }
};
module.exports = customerAuthMiddleware;
