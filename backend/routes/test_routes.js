const express = require("express");
const testRoutes = express.Router();
const dbo = require("../db/conn");

const ObjectId = require("mongodb").ObjectId;

const roles= ['administrator', 'employee', 'customer']

var customer = {
	firstname: "Cooper",
	lastname: "Maitoza",
	customerid: "cm123456789",
	username: "maito",
	accounts: [
		{accountName: "Savings", amount: 0, history: [
			{type: "Transfer", amount: 400, date: new Date('2018-03-24T10:48:30'), recipient: "Checking"},
				{type: "Withdraw", amount: -200, date: new Date(2018, 3, 24, 10, 30, 70), recipient: "User"},
				{type: "Deposit", amount: 200, date: new Date(2022, 12, 11, 4, 10, 30), recipient: "Savings"}, 
				{type: "Transaction", amount: -400, date: new Date(2022, 12, 11, 4, 10, 30), recipient: "Unknown"},
		]},
		{accountName: "Checking", amount: 0, history:[
			{type: "Transfer", amount: 420, date: new Date('2018-03-24T10:48:30'), recipient: "Checking"},
			{type: "Transaction", amount: -420, date: new Date(2022, 12, 11, 4, 10, 30), recipient: "Apple Inc"}, 
		]},
		{accountName: "Investments", amount: 42, history:[
			{type: "Transfer", amount: -42, date: new Date('2018-03-24T10:48:30'), recipient: "John Smith"},
		]}
	],
	role: "customer"
}

//1. route that taks req.session.username and sets session, grabs word from database
// sets up correctWord and word, returns success status 200
testRoutes.route("/login").post(async (req, res) => {
	try {
		req.session.username = req.body.username
		req.session.accounts = [
			{accountName: "Savings", amount: 2000, history: [
				{type: "Transfer", amount: -400, date: new Date('2018-03-24T10:48:30'), recipient: "Checking"},
				{type: "Withdraw", amount: -800, date: new Date(2018, 3, 24, 10, 30, 70), recipient: "User"}, //prefer this method
				{type: "Deposit", amount: 900, date: new Date(2022, 12, 11, 4, 10, 30), recipient: "Savings"}, 
				{type: "Transaction", amount: -80, date: new Date(2022, 12, 11, 4, 10, 30), recipient: "Unknown"}, 

			]},
			{accountName: "Checking", amount: 4000, history:[
				{type: "Transfer", amount: 400, date: new Date('2018-03-24T10:48:30'), recipient: "Checking"},
				{type: "Transaction", amount: -824.89, date: new Date(2022, 12, 11, 4, 10, 30), recipient: "Apple Inc"}, 
			]},
			{accountName: "Investments", amount: 800, history:[
				{type: "Transfer", amount: -1200, date: new Date('2018-03-24T10:48:30'), recipient: "John Smith"},

			]},
		]
		req.session.role = roles[0]
		
		return res.status(200).json("Loged in");
	} catch (err) {
		return res.status(301).json("Error logging in" + err);
	}
});

testRoutes.route("/bankDetails").post(async (req, res) => {

	res.status(200).json({
		username: req.session.username,
		role: req.session.role,
		accounts: req.session.accounts

	});
});


testRoutes.route("/accountDetails").post(async (req, res) => {
	const details = (req.session.accounts).filter((account)=> (
		account.accountName == req.body.accountName
	))

	res.status(200).json({
		username: req.session.username,
		role: req.session.role,
		accounts: details
	});
});


testRoutes.route("/role").get(async (req, res) => {
	res.status(200).json({
		role: req.session.role
	})
})

testRoutes.route("/changeRole").post(async (req, res) => {
	req.session.role = req.body.role

	res.status(200).json({
		role: req.session.role
	})
})


testRoutes.route("/withdraw").post(async (req, res) => {
	const accountNa = req.body.accountName
	const totalChange = -req.body.withdrawAmount

	const details = (req.session.accounts).map((account)=> {
		if (account.accountName == accountNa){
			account.amount += totalChange
			account.history.push({
				type: "Withdraw",
				amount: totalChange,
				date: Date.now(),
				recipient: account.accountName,
			})
		}
		return account
	})
	req.session.accounts

	res.status(200).json({
	})
})


testRoutes.route("/deposit").post(async (req, res) => {
	const accountNa = req.body.accountName
	const totalChange = req.body.depositAmount

	const details = (req.session.accounts).map((account)=> {
		if (account.accountName == accountNa){
			account.amount += totalChange
			account.history.push({
				type: "Deposit",
				amount: totalChange,
				date: Date.now(),
				recipient: account.accountName,
			})
		}
		return account
	})

	res.status(200).json({
	})
})

// TEST ROUTE
testRoutes.route("/createAccount").post(async (req, res) => {
  try {
    let db_connect = dbo.getDb();
    let myobj = {
			username: req.body.username,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      phone: req.body.phone,
      password: req.body.password,
      roles: "",
      // savings: 0,
      // checking: 0
    };
    const check = await db_connect.collection("accounts").findOne({email: req.body.email});
    // if (check != null) {
    //   res.json({check: false});
    //   return;
    // }
    db_connect.collection("accounts").insertOne(myobj);
    res.json({check: true});
  } catch(err) {
    throw err;
  }
});


testRoutes.route("/logout").get(async (req, res) => {
	req.session.destroy();
	let status = "No session set";
	const resultObj = { status: status };
	res.json(resultObj);
});

testRoutes.route("/checkCustomerID/:id").post(async (req, res) => {
  try {
		if (customer.customerid == req.params.id) {
			req.session.customerSearch = customer.customerid;
			res.status(200).json({
				check: true
			});
		} else {
			req.session.customerSearch = "";
			res.status(301).json({check: false})
		}
  } catch(err) {
    throw err;
  }
});
testRoutes.route("/getCustomerSummary").post(async (req, res) => {
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

testRoutes.route("/changeCustomerRole").post(async (req, res) => {
	try {
		customer.role = req.body.role

		res.status(200).json({ role: customer.role});
	} catch(err) {
		throw err;
	}
})

module.exports = testRoutes;