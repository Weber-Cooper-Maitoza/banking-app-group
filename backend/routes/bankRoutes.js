const express = require("express");
const bank = express.Router();
const dbo = require("../db/conn");

const ObjectId = require("mongodb").ObjectId;

bank.route("/").post(async (req, res) => {

});

module.exports = bank