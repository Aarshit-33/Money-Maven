const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		amount: {
			type: Number,
			required: true,
			min: 0,
		},
		type: {
			type: String,
			enum: ["income", "expense"],
			required: true,
		},
		category: {
			type: String,
			required: true,
			enum: [
				"Salary",
				"Business",
				"Investment",
				"Freelancing", // For income
				"Rent",
				"Food",
				"Transportation",
				"Entertainment", // For expenses
				"Healthcare",
				"Utilities",
				"Other",
			],
		},
		description: {
			type: String,
			maxlength: 500,
		},
		date: {
			type: Date,
			required: true,
			default: Date.now,
		},
	},
	{ timestamps: true }
);

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;
