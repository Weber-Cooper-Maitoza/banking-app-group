const express = require("express");
const bank = express.Router();
const dbo = require("../db/conn");
const crypto = require("crypto");
const ObjectId = require("mongodb").ObjectId;

const hashPass = (password) => {
    return crypto.createHash('sha256').update(password).digest('hex');
}

bank.route("/").post(async (req, res) => {

});


// Create account route
bank.route("/createAccount").post (async (req, res) => {
    const db_connect = dbo.getDb().collection("accounts");
    const { userName, firstname, lastname, email, phone, password, role } = req.body;
  
    try {
      // Check if existing user
      const exists = await db_connect.findOne({ username: userName });
      if (exists) {
        return res.status(409).json("Username already exists");
      }
  
      // Create customerId and password
      const newPassword = hashPass(password);
      console.log(newPassword);

      let userId;
      do {
        userId = `${firstname[0]}${lastname[0]}${Math.floor(10000 + Math.random() * 90000)}`;
      } while (await db_connect.findOne({ customerId: userId }));
      console.log(userId);
  
      const newAccount = {
        firstname: firstname,
        lastname: lastname,
        customerId: userId,
        username: userName,
        email: email,
        phone: phone,
        passHash: newPassword,
        accounts: [
          { accountName: "Savings", amount: 0, history: [] },
          { accountName: "Checking", amount: 0, history: [] },
          { accountName: "Investments", amount: 0, history: [] }
        ],
        role: role
      };
  
      await db_connect.insertOne(newAccount);
      res.status(201).json("Account created successfully!" );

    } catch (error) {
      console.error(error);
      res.status(301).json("Internal server error");
    }
  });

// Login route
bank.route("/login").post(async (req, res) => {
    const db_connect = dbo.getDb().collection("accounts");
    const { userName, password } = req.body;
  
    try {
      const user = await db_connect.findOne({ username: userName });
      if (!user) {
        return res.status(301).json("The username and/or password was not entered in correctly");
      }
  
      const hashedPassword = password;
      if (hashedPassword !== user.password) {
        return res.status(301).json("The username and/or password was not entered in correctly");
      }
  
      // Create a session for the user
      req.session.user = {
        username: userName,
        role: user.role,
        customerId: user.customerId
      };
  
      res.status(200).json("Login successful!" );
    } catch (error) {
      console.error(error);
      res.status(301).json("Internal server error");
    }
  });
  
// Logout route
bank.route("/logout").post( async (req, res) => {
    req.session.destroy((err) => {
        if (err) {
        return res.status(301).json({ message: "Failed to log out" });
        }
        res.status(200).json("Logout successful");
    });
});

module.exports = bank