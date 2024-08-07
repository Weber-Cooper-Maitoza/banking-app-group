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
  const { username, firstname, lastname, email, phone, password, role } = req.body

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

// FIXME: Account Details Route
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



// Check Customer ID Route
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

// Get Customer Summary Route
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

// Transfer Funds from one account to another Route.
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
  } catch(err) {
    throw err;
  }
});    
    
module.exports = bank