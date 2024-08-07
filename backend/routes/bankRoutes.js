const express = require("express");
const bank = express.Router();
const dbo = require("../db/conn");

const ObjectId = require("mongodb").ObjectId;

// FIXME: TEST Database Routes
bank.route("/login").post(async (req, res) => {
  try {
    let check;
    let db_connect = dbo.getDb("bank");
    let myquery = { 
      username: req.body.username,
      passHash: req.body.passHash
    };
    const result = await db_connect.collection("accounts").findOne(myquery);
    if (result != null) {
      check = true;
      req.session.username = req.body.username;
      req.session.role = result.role;
    } else {
      check = false;
    }
    const checkObj = { check: check };
    res.json(checkObj);
  } catch(err) {
    throw err;
  }
});

bank.route("/createAccount").post(async (req, res) => {
  try {
    let db_connect = dbo.getDb();
    let myobj = {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      customerid: req.body.customerid,

      username: req.body.username,
      passHash: req.body.passHash,

      accounts: [
        {accountName: "Savings", amount: 0, history: []},
        {accountName: "Checking", amount: 0, history: []},
      ],
      role: req.body.role
    };
    const check = await db_connect.collection("accounts").findOne({username: req.body.username});
    if (check != null) {
      res.json({check: false});
      return;
    }
    db_connect.collection("accounts").insertOne(myobj);
    res.json({check: true});
  } catch(err) {
    throw err;
  }
});

bank.route("/getSessionRole").post(async (req, res) => {
  try {
    if (!req.session.role) {
      res.status(200).json({ role: req.session.role, check: true});
      return;
    }
    res.status(301).json({ check: false });
  } catch(err) {
    throw err;
  }
});

bank.route("/accountDetails/:id").post(async (req, res) => {
  try {
    let db_connect = dbo.getDb();
    let myquery = { customerid: req.params.id };
    const options = { projection: { _id: 0, passHash: 0 }}
    const result = await db_connect.collection("accounts").findOne(myquery, options);
    res.status(200).json(result);
  } catch(err) {
    throw err;
  }
});



// COOPER's ROUTES

bank.route("/checkCustomerID/:id").post(async (req, res) => {
  try {
    let db_connect = dbo.getDb("bank");
    const check = await db_connect.collection("accounts").findOne({customerid: req.params.id});
    if (check == null) {
      res.json({check: false});
      return;
    }
    req.session.searchedCustomerID = req.params.id;
    res.json({check: true});

  } catch(err) {
    throw err;
  }
});

bank.route("/getCustomerSummary").post(async (req, res) => {
	try {
		if (customer.customerid == req.session.customerSearch) {
			res.status(200).json({
				customerid: customer.customerid,
				firstname: customer.firstname,
				lastname: customer.lastname,
				username: customer.username,
				role: customer.role,
				accounts: customer.accounts,
				check: true
			});
		} else {
			res.status(301).json ({
				check: false
			})
		}
	} catch(err) {
		throw err;
	}
});

bank.route("/employee/transfer/:id").post(async (req, res) => {
  try {

    // 1. get session.searchedCustomerID's account
    // 2. get transfer customerID's account
    // 3. withdraw amount from transfer customer
      // 3.1. check if amount is not negitive from account.
      // 3.2. if not, set check to true.
    // 4. if transfer customer has enough funds for transfer (if check is true),
    //    add amount to session.searchedCustomerID's account.

    let db_connect = dbo.getDb();
    // steps 1 & 2.
    let transferAccount = await db_connect.collection("accounts").findOne({ customerid: req.params.id });
    let currentCustomerAccount = await db_connect.collection("accounts").findOne({ customerid: req.session.searchedCustomerID });

    // if (req.body.savings != null && req.body.checking == null) {
    //   if (!(/^\+?(0|[1-9]\d*)$/.test(req.body.savings) || /^\+?(0|[1-9]\d*)$/.test(req.body.checking))) {
    //     res.json("ERROR: savings is not a valid number.");
    //     return;
    //   }

    //   if (newSavings["savings"] - parseInt(req.body.savings) < 0) {
    //     res.json("ERROR: Tried to withdraw more money than available.")
    //     return;
    //   }
    //   newSavings["savings"] -= parseInt(req.body.savings);
    //   newChecking["checking"] += parseInt(req.body.savings);

    // } else if (req.body.savings == null && req.body.checking != null) {
    //   if (!(/^\+?(0|[1-9]\d*)$/.test(req.body.savings) || /^\+?(0|[1-9]\d*)$/.test(req.body.checking))) {
    //     res.json("ERROR: savings is not a valid number.");
    //     return;
    //   }

    //   if (newChecking["checking"] - parseInt(req.body.checking) < 0) {
    //     res.json("ERROR: Tried to withdraw more money than available.")
    //     return;
    //   }
    //   newChecking["checking"] -= parseInt(req.body.checking);
    //   newSavings["savings"] += parseInt(req.body.checking);

    // } else {
    //   res.json("ERROR: do not know what to transfer.")
    //   return;
    // }

    // let newvalues = {
    //   $set: {
    //     savings: newSavings["savings"],
    //     checking: newChecking["checking"]
    //   },
    // };

    // await db_connect.collection("accounts").updateOne(myquery, newvalues);
    // const result = await db_connect.collection("accounts").findOne(myquery, {projection: {_id: 0, savings: 1, checking: 1}});
    // res.json(result);
  } catch(err) {
    throw err;
  }
});

module.exports = bank