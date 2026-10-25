const bcrypt = require("bcrypt");
const User = require("../models/user");

// Creates the default admin account on first run
const seedAdmin = async () => {
    const email = process.env.ADMIN_EMAIL || "admin@twinfin.com";
    const exists = await User.findOne({ email });
    if (exists) return;
    const password = await bcrypt.hash(process.env.ADMIN_PASSWORD || "admin123", 10);
    await User.create({ name: "Admin", email, password, role: "admin" });
    console.log(`admin seeded: ${email}`);
};
module.exports = seedAdmin;
