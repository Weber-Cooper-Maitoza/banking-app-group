const express = require("express");
const bank = express.Router();
const dbo = require("../db/conn");
const crypto = require("crypto");
const ObjectId = require("mongodb").ObjectId;

const hashPass = (password) => {
  if (!password) {
    throw new Error('Password is required');
  }
    return crypto.createHash('sha256').update(password).digest('hex');
}

// Create account route
bank.post("/createAccount", async (req, res) => {
  const db_connect = dbo.getDb().collection("accounts");
  const { username, firstname, lastname, email, phone, password, role } = req.body;

  try {
    console.log(req.body);

    if (!username || !firstname || !lastname || !email || !phone || !password || !role) {
      return res.status(400).json("All fields are required");
    }

    // Check if existing user
    const exists = await db_connect.findOne({ username: username });
    if (exists) {
      return res.status(400).json("Username already exists");
    }

    // Create customerId and hashed password
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
      username: username,
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
    res.status(201).json("Account created successfully!") ;
  } catch (error) {
    console.error(error);
    res.status(500).json("Error inside create account" );
  }
  });

// Login route
bank.post("/login", async (req, res) => {
    const db_connect = dbo.getDb().collection("accounts");
    const { userName, password } = req.body;
  
    try {
      const user = await db_connect.findOne({ username: userName });
      if (!user) {
        return res.status(400).json("The username or password was not entered in correctly");
      }
  
      const hashedPassword = password;
      if (hashedPassword !== user.password) {
        return res.status(400).json("The username or password was not entered in correctly");
      }
  
      // Create session
      req.session.user = {
        username: userName,
        role: user.role,
        customerId: user.customerId
      };
  
      res.status(200).json("Login successful!" );
    } catch (error) {
      console.error(error);
      res.status(400).json("Error in Login");
    }
  });
  
// Logout route
bank.post("/logout", async (req, res) => {
    req.session.destroy((err) => {
        if (err) {
        return res.status(301).json("Failed to log out");
        }
        res.status(200).json("Logout successful");
    });
});

module.exports = bank