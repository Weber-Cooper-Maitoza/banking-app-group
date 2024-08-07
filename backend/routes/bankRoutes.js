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
      // username: "",
      // passHash: "",
    };
    const result = await db_connect.collection("accounts").findOne(myquery);
    if (result != null) {
      check = true;
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
      // firstname: "",
      // lastname: "",
      // luustomerid: "",
      // username: "",
      // passHash: "",
      // accounts: [
      //   {accountName: "Savings", amount: 0, history: [
      //     {type: "", amount: Double, date: new Date(''), recipient: ""},
      //   ]},
      //   {accountName: "Checking", amount: 0, history:[
      //     {type: "", amount: Double, date: new Date(''), recipient: ""},
      //   ]},
      //   {accountName: "Investments", amount: 0, history:[
      //     {type: "", amount: Double, date: new Date(''), recipient: ""},
      //   ]}
      // ],
      // role: ""
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