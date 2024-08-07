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





///////delete all of this , this is from test routes 
bank.route("/accountDetails").post(async (req, res) => {
	// const details = (req.session.accounts).filter((account)=> (
	// 	account.accountName == req.body.accountName
	// ))

	res.status(200).json({
		username: req.session.username,
		role: req.session.role,
		accounts: req.session.accounts,
		firstname: req.session.firstname,
		lastname: req.session.lastname,
	});
});


bank.route("/role").get(async (req, res) => {
	res.status(200).json({
		role: req.session.role
	})
})


bank.route("/changeRole").post(async (req, res) => {
	req.session.role = req.body.role

	res.status(200).json({
		role: req.session.role
	})
})

// Coleton
bank.route("/withdraw").post(async (req, res) => {
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

//Coleton
bank.route("/deposit").post(async (req, res) => {
	const accountNa = req.body.accountName
	const totalChange = req.body.depositAmount

	const userAccount = req.session.accounts

	const details = (userAccount).map((account)=> {
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

// Brody
bank.route("/createAccount").post(async (req, res) => {
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


bank.route("/logout").get(async (req, res) => {
	req.session.destroy();
	let status = "No session set";
	const resultObj = { status: status };
	res.json(resultObj);
});



//Copper
bank.route("/checkCustomerID/:id").post(async (req, res) => {
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

//
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

//
bank.route("/changeCustomerRole").post(async (req, res) => {
	try {
		customer.role = req.body.role

		res.status(200).json({ role: customer.role});
	} catch(err) {
		throw err;
	}
})
module.exports = bank