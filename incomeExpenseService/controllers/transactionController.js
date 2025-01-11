const Transaction = require("../models/Transaction");

const addTransaction = async (req, res) => {
	try {
		const transaction = new Transaction({
			userId: req.user._id,
			...req.body,
		});
		await transaction.save();
		res.status(201).json({ transaction });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const getTransactions = async (req, res) => {
	try {
		const transactions = await Transaction.find({ userId: req.user._id });
		res.json({ transactions });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const getTransaction = async (req, res) => {
	try {
		const transaction = await Transaction.findOne({
			_id: req.params.id,
			userId: req.user._id,
		});
		if (!transaction) {
			return res.status(404).json({ message: "Transaction not found" });
		}
		res.json({ transaction });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const updateTransaction = async (req, res) => {
	try {
		const transaction = await Transaction.findOne({
			_id: req.params.id,
			userId: req.user._id,
		});
		if (!transaction) {
			return res.status(404).json({ message: "Transaction not found" });
		}
		Object.assign(transaction, req.body);
		await transaction.save();
		res.json({ transaction });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const deleteTransaction = async (req, res) => {
	try {
		const transaction = await Transaction.findOne({
			_id: req.params.id,
			userId: req.user._id,
		});
		if (!transaction) {
			return res.status(404).json({ message: "Transaction not found" });
		}
		await transaction.remove();
		res.json({ message: "Transaction deleted" });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

module.exports = {
	addTransaction,
	getTransactions,
	getTransaction,
	updateTransaction,
	deleteTransaction,
};
