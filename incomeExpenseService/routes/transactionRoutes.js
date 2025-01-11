const express = require("express");
const router = express.Router();
const {
	addTransaction,
	getTransactions,
	getTransaction,
	updateTransaction,
	deleteTransaction,
} = require("../controllers/transactionController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/addTransaction", authMiddleware, addTransaction);
router.get("/getTransactions", authMiddleware, getTransactions);
router.get("/getTransaction/:id", authMiddleware, getTransaction);
router.put("/updateTransaction/:id", authMiddleware, updateTransaction);
router.delete("/deleteTransaction/:id", authMiddleware, deleteTransaction);

module.exports = router;
