const express = require("express");
const bank = express.Router();
const dbo = require("../db/conn");

const ObjectId = require("mongodb").ObjectId;

bank.route("/cu-deposit").post(async (req, res) =>{
	try{
	  if(!req.session.username){
		return res.status(301).json("Not Logged In")
	  }
	  const accountNa = req.body.accountName
	  const totalChange = req.body.depositAmount
  
	  const db_connect = dbo.getDb().collection("words");
  
	  const bankDetails = await db_connect.findOne(
		{username: req.session.username, passHash: req.session.passHash}
	  )
  
	  const details = (bankDetails.account).map((account)=> {
		if (account.accountName == accountNa){
		  account.amount += totalChange
		  account.history.push({
			type: "Deposit",
			amount: totalChange,
			date: Date.now(),
			recipient: account.accountName,
		  })
		}
	  })
	  const x = await db_connect.findOneAndReplace({username: req.session.username, passHash: req.session.passHash}, details)
  
	  res.status(200).json({
	  x
	  })
  
	}catch(err){
	  throw err;
	}
  });
  
  bank.route("/cu-accountDetails").post(async (req, res) =>{
	try{
	  if(!req.session.username){
		return res.status(301).json("Not Logged In")
	  }
	  const accountNa = req.body.accountName
	  const totalChange = req.body.depositAmount
  
	  const db_connect = dbo.getDb().collection("words");
  
	  const bankDetails = await db_connect.findOne(
		{username: req.session.username, passHash: req.session.passHash}
	  )
  
	  return res.status(200).json(bankDetails)
	}catch(err){
	  throw err
	}
  });

  module.exports = bank