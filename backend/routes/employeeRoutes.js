const express = require("express");
const bank = express.Router();
const dbo = require("../db/conn");

const ObjectId = require("mongodb").ObjectId;


// bank.route("/changeCustomerRole").post(async (req, res) => {
// 	try {
// 	  let db_connect = dbo.getDb();
// 	  let changeRole = {
// 		$set: {
// 		  role: req.body.role
// 		}
// 	  };
// 	  const result = db_connect.collection("accounts").updateOne({customerId: req.session.searchedCustomerID}, changeRole);
// 	  res.status(200).json(result);
// 	} catch(err) {
// 	  throw err;
// 	}
// })


bank.route("/emp-outside-transfer").post(async (req, res) => {
	try {
		if (!req.session.searchedCustomerID) {
			return res.status(301).json("Not Logged In");
		}
		const db_connect = dbo.getDb().collection("accounts");

		const fromUserAccount = await db_connect.findOne({
			customerId: req.session.searchedCustomerID,
		});		
		
		const from = req.body.from;
		const totalChange = +req.body.amount ?? 0;
		const to = req.body.to;



		const toUserAccount = await db_connect.findOne({
			customerId: req.body.toUser,
		});
		if(!toUserAccount){
			return res.status(302).json()
		}

		var fromSelectedAccount;
		var toSelectedAccount;
		fromUserAccount.accounts = fromUserAccount.accounts.map((account) => {
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
			return account;
		});

		toUserAccount.accounts = toUserAccount.accounts.map((account) => {
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

		_ = await db_connect.findOneAndReplace(
			{ customerId:  req.session.searchedCustomerID },
			fromUserAccount
		);
		_ = await db_connect.findOneAndReplace(
			{ customerId: req.body.toUser },
			toUserAccount
		);
		const returnValue = fromUserAccount.accounts
		res.status(200).json({
			returnValue,
		});
	} catch (err) {
		throw err;
	}
});

bank.route("/emp-transfer").post(async (req, res) => {
	try {
		if (!req.session.searchedCustomerID) {
			return res.status(301).json("Not Logged In");
		}
		const from = req.body.from;
		const totalChange = +req.body.amount ?? 0;
		const to = req.body.to;


		const db_connect = dbo.getDb().collection("accounts");

		const bankDetails = await db_connect.findOne({
			customerId: req.session.searchedCustomerID,
		});

		var fromSelectedAccount;
		var toSelectedAccount;
		bankDetails.accounts = bankDetails.accounts.map((account) => {
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

		const x = await db_connect.findOneAndReplace(
			{ customerId: req.session.user.customerId },
			bankDetails
		);
		const returnValue = bankDetails.accounts
		res.status(200).json({
			returnValue,
		});
	} catch (err) {
		throw err;
	}
});

module.exports = bank;
