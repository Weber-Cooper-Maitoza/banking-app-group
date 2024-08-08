const express = require("express");
const bank = express.Router();
const dbo = require("../db/conn");

const ObjectId = require("mongodb").ObjectId;

bank.route("/cu-deposit").post(async (req, res) => {
	try {
		if (!req.session.user) {
			return res.status(301).json("Not Logged In");
		}
		const accountNa = req.body.accountName;
		const totalChange = +req.body.depositAmount ?? 0;

		const db_connect = dbo.getDb().collection("accounts");

		const bankDetails = await db_connect.findOne({
			customerId: req.session.user.customerId,
		});
		var selectedAccount;
		bankDetails.accounts = bankDetails.accounts.map((account) => {
			if (account.accountName == accountNa) {
				account.amount += totalChange;
				account.history.push({
					type: "Deposit",
					amount: totalChange,
					date: Date.now(),
					recipient: account.accountName,
				});
				selectedAccount = account;
			}

			return account;
		});

		const x = await db_connect.findOneAndReplace(
			{ customerId: req.session.user.customerId },
			bankDetails
		);

		res.status(200).json({
			selectedAccount,
		});
	} catch (err) {
		throw err;
	}
});

bank.route("/cu-withdraw").post(async (req, res) => {
	try {
		if (!req.session.user) {
			return res.status(301).json("Not Logged In");
		}
		const accountNa = req.body.accountName;
		const totalChange = -req.body.withdrawAmount ?? 0;

		const db_connect = dbo.getDb().collection("accounts");

		const bankDetails = await db_connect.findOne({
			customerId: req.session.user.customerId,
		});
		var selectedAccount;
		bankDetails.accounts = bankDetails.accounts.map((account) => {
			if (account.accountName == accountNa) {
				account.amount += totalChange;
				account.history.push({
					type: "Withdraw",
					amount: totalChange,
					date: Date.now(),
					recipient: account.accountName,
				});
				selectedAccount = account;
			}

			return account;
		});

		if (selectedAccount.amount < 0) {
			return res.status(301).json();
		}

		const x = await db_connect.findOneAndReplace(
			{ customerId: req.session.user.customerId },
			bankDetails
		);

		res.status(200).json({
			selectedAccount,
		});
	} catch (err) {
		throw err;
	}
});

bank.route("/cu-transfer").post(async (req, res) => {
	try {
		if (!req.session.user) {
			return res.status(301).json("Not Logged In");
		}
		const from = req.body.from;
		const totalChange = +req.body.amount ?? 0;
		const to = req.body.to;


		const db_connect = dbo.getDb().collection("accounts");

		const bankDetails = await db_connect.findOne({
			customerId: req.session.user.customerId,
		});

		var fromSelectedAccount;
		var toSelectedAccount;
		const newAccounts = bankDetails.accounts.map((account) => {
			if (account.accountName == from) {
				account.amount -= totalChange;
				account.history.push({
					type: "Transfer",
					amount: totalChange,
					date: Date.now(),
					recipient: account.accountName,
				});
				fromSelectedAccount = account;
			}

			if (account.accountName == to) {
				account.amount += totalChange;
				account.history.push({
					type: "Transfer",
					amount: totalChange,
					date: Date.now(),
					recipient: account.accountName,
				});
				toSelectedAccount = account;
			}

			return account;
		});

		if (fromSelectedAccount.amount < 0 || toSelectedAccount.amount < 0) {
			return res.status(301).json();
		}


		const x = await db_connect.updateOne(
			{ customerId: req.session.user.customerId },
			{$set: {accounts: newAccounts}}
		);
		const returnValue = newAccounts
		res.status(200).json({
			returnValue,
		});
	} catch (err) {
		throw err;
	}
});

bank.route("/cu-accountDetails").post(async (req, res) => {
	try {
		if (!req.session.username) {
			return res.status(301).json("Not Logged In");
		}
		const accountNa = req.body.accountName;
		const totalChange = req.body.depositAmount;

		const db_connect = dbo.getDb().collection("accounts");

		const bankDetails = await db_connect.findOne({
			customerId: req.session.user.customerId,
		});

		return res.status(200).json(bankDetails);
	} catch (err) {
		throw err;
	}
});

module.exports = bank;
