require('dotenv').config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const connectDB = require("./config/db");
const seedAdmin = require("./config/seedadmin");
const seedCategories = require("./config/seedcategories");
const adRoutes = require("./routes/adRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/ad", adRoutes);
app.use("/", userRoutes);

connectDB().then(async () => {
    await seedAdmin();
    await seedCategories();
});



// Port: use PORT from .env if set, otherwise let the OS pick any free port.
// The chosen port is written to ../.backend-port so the React dev servers can find it.
const fs = require("fs");
const PORT_FILE = path.join(__dirname, "..", ".backend-port");

const server = app.listen(Number(process.env.PORT) || 0, () => {
    const { port } = server.address();
    fs.writeFileSync(PORT_FILE, String(port));
    console.log(`twinfin api running on port ${port}`);
});

const cleanup = () => {
    try { fs.unlinkSync(PORT_FILE); } catch (_) {}
    process.exit(0);
};
process.on("SIGINT", cleanup);
process.on("SIGTERM", cleanup);
process.once("SIGUSR2", () => { // nodemon restart
    try { fs.unlinkSync(PORT_FILE); } catch (_) {}
    process.kill(process.pid, "SIGUSR2");
});
