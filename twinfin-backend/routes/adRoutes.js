const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authmiddleware");

const loginCtrl = require("../controller/admin/login");
const categoryCtrl = require("../controller/admin/categorycrud");
const customerCtrl = require("../controller/admin/customercrud");
const statsCtrl = require("../controller/admin/stats");

router.post("/login", loginCtrl.login);

router.get("/stats", authMiddleware, statsCtrl.getStats);

router.get("/category", authMiddleware, categoryCtrl.getCategories);
router.get("/category/:id", authMiddleware, categoryCtrl.getCategory);
router.post("/category", authMiddleware, categoryCtrl.createCategory);
router.put("/category/:id", authMiddleware, categoryCtrl.updateCategory);
router.delete("/category/:id", authMiddleware, categoryCtrl.deleteCategory);

router.get("/customers", authMiddleware, customerCtrl.getCustomers);
router.patch("/customers/:id/toggle", authMiddleware, customerCtrl.toggleCustomer);
router.delete("/customers/:id", authMiddleware, customerCtrl.deleteCustomer);

module.exports = router;
