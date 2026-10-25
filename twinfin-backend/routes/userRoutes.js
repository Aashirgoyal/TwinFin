const express = require("express");
const router = express.Router();
const customerAuthMiddleware = require("../middleware/customerauthmiddleware");

const userLrCtrl = require("../controller/user/user-lr");
const categoryUserCtrl = require("../controller/user/categoryuser");
const transactionCtrl = require("../controller/user/transactionuser");
const budgetCtrl = require("../controller/user/budgetuser");
const goalCtrl = require("../controller/user/goaluser");
const dashboardCtrl = require("../controller/user/dashboarduser");

router.post("/register", userLrCtrl.register);
router.post("/login", userLrCtrl.login);
router.get("/category", categoryUserCtrl.getActiveCategories);

router.get("/profile", customerAuthMiddleware, userLrCtrl.getProfile);
router.put("/profile", customerAuthMiddleware, userLrCtrl.updateProfile);

router.get("/dashboard", customerAuthMiddleware, dashboardCtrl.getDashboard);

router.get("/transactions", customerAuthMiddleware, transactionCtrl.getTransactions);
router.post("/transactions", customerAuthMiddleware, transactionCtrl.createTransaction);
router.put("/transactions/:id", customerAuthMiddleware, transactionCtrl.updateTransaction);
router.delete("/transactions/:id", customerAuthMiddleware, transactionCtrl.deleteTransaction);

router.get("/budgets", customerAuthMiddleware, budgetCtrl.getBudgets);
router.post("/budgets", customerAuthMiddleware, budgetCtrl.saveBudget);
router.delete("/budgets/:id", customerAuthMiddleware, budgetCtrl.deleteBudget);

router.get("/goals", customerAuthMiddleware, goalCtrl.getGoals);
router.post("/goals", customerAuthMiddleware, goalCtrl.createGoal);
router.put("/goals/:id", customerAuthMiddleware, goalCtrl.updateGoal);
router.delete("/goals/:id", customerAuthMiddleware, goalCtrl.deleteGoal);

module.exports = router;
