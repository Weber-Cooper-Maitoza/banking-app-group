const express = require("express");
const bank = express.Router();
const dbo = require("../db/conn");

const ObjectId = require("mongodb").ObjectId;


// Check Customer ID Route
bank.route("/checkCustomerID/:id").post(async (req, res) => {
	try {
	  let db_connect = dbo.getDb("bank");
	  const check = await db_connect.collection("accounts").findOne({customerId: req.params.id});
	  if (check == null) {
		res.json({check: false});
		return;
	  }
	  req.session.searchedCustomerID = req.params.id;
	  res.status(200).json({check: true});
	} catch(err) {
	  throw err;
	}
  });
  
  // Get Customer Summary Route
  bank.route("/getCustomerSummary").post(async (req, res) => {
	  try {
	  if (!req.session.searchedCustomerID) {
		return res.status(301).json()
	  }
	  let db_connect = dbo.getDb();
	  const options = { projection: { _id: 0, passHash: 0 }}
	  const customerInfo = await db_connect.collection("accounts").findOne({customerId: req.session.searchedCustomerID}, options);
	  res.status(200).json(customerInfo);
	  } catch(err) {
		  throw err;
	  }
  });
  
  // Change customer role via admin access.
  bank.route("/changeCustomerRole").post(async (req, res) => {
	try {
	  let db_connect = dbo.getDb();
	  let changeRole = {
		$set: {
		  role: req.body.role
		}
	  };
	  const result = db_connect.collection("accounts").updateOne({customerId: req.session.searchedCustomerID}, changeRole);
	  res.status(200).json(req.body.role);
	} catch(err) {
	  throw err;
	}
  })
    
  // Deposit from searched customer's account via employee.
  bank.route("/employee/deposit").post(async (req, res) => {
	try{
	  const db_connect = dbo.getDb();
  
	  const accountNa = req.body.accountName;
	  const amount = parseFloat(req.body.depositAmount);
  
	  const customerInfo = await db_connect.collection("accounts").findOne({customerId: req.session.searchedCustomerID});
	  const newAccount = (customerInfo.accounts).map((account) => {return account;});
	  let updatedAccount;
	  newAccount.forEach((accounts)=> {
		if (accounts.accountName == accountNa){
		  accounts.amount = amount + parseFloat(accounts.amount);
		  accounts.history.push({
			type: "Deposit",
			amount: `$${amount}`,
			date: Date.now(),
			recipient: accounts.accountName,
		  })
		  updatedAccount = accounts
		}
	  });
  
	  let newAccountStatement = {
		$set: {
		  accounts: newAccount
		}
	  };
	  const result = db_connect.collection("accounts").updateOne({customerId: req.session.searchedCustomerID}, newAccountStatement);
  
	  res.status(200).json(updatedAccount)
	}catch(err){
	  throw err;
	}
  });
	  
  // Withdraw from searched customer's account via employee.
  bank.route("/employee/withdraw").post(async (req, res) => {
	try{
	  const db_connect = dbo.getDb();
  
	  const accountNa = req.body.accountName;
	  const amount = parseFloat(req.body.depositAmount);
  
	  const customerInfo = await db_connect.collection("accounts").findOne({customerId: req.session.searchedCustomerID});
	  const newAccount = (customerInfo.accounts).map((account) => {return account;});
	  let newTotal
	  let updatedAccount;
  
	  newAccount.forEach((accounts)=> {
		if (accounts.accountName == accountNa){
		  newTotal = Math.round((parseFloat(accounts.amount) - amount) * 100) / 100
		  
		  accounts.amount = newTotal;
		  accounts.history.push({
			type: "Withdraw",
			amount: `$${amount}`,
			date: Date.now(),
			recipient: accounts.accountName,
		  })
		  updatedAccount = accounts
		}
	  });
	  //Can't be inside for each
	  if (newTotal < 0) {
		return res.status(301).json("Cannot withdraw more than available.");
	  }
  
	  let newAccountStatement = {
		$set: {
		  accounts: newAccount
		}
	  };
	  const result = db_connect.collection("accounts").updateOne({customerId: req.session.searchedCustomerID}, newAccountStatement);
  
	  return res.status(200).json(updatedAccount)
	}catch(err){
	  throw err;
	}
  });

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
					recipient: `${toUserAccount.username}  ${account.accountName}`,
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
					recipient: `${toUserAccount.username}  ${account.accountName}`,
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
		const newAccount = bankDetails.accounts.map((account) => {
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
			{$set: {accounts: newAccount}}
		);
		const returnValue = newAccount
		res.status(200).json({
			returnValue,
		});
	} catch (err) {
		throw err;
	}
});

module.exports = bank;
