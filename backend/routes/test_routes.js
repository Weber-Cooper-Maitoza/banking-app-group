const express = require("express");
const testRoutes = express.Router();
const dbo = require("../db/conn");

const ObjectId = require("mongodb").ObjectId;

const roles= ['administrator', 'employee', 'customer']

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
		
		return res.status(200).json("Game has been started");
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


testRoutes.route("role").get(async (req, res) => {

	req.status(200).json({
		role: req.session.role
	})
})

testRoutes.route("changeRole").post(async (req, res) => {
	req.session.role = req.body.role

	req.status(200).json({
		role: req.session.role
	})
})

testRoutes.route("withdraw").post(async (req, res) => {
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

	req.status(200).json({
	})
})


testRoutes.route("deposit").post(async (req, res) => {
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

	req.status(200).json({
	})
})

module.exports = testRoutes;