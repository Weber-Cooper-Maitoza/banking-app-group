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
      // customerid: "",
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

module.exports = bank