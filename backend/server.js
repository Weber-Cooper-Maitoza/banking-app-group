const express = require("express");
const app = express();
const cors = require("cors");

const session = require("express-session");
const crypto = require("crypto");
const MongoStore = require("connect-mongo");

require("dotenv").config({ path: "./config.env"});

app.use(cors(
  {
    origin: "http://localhost:3000",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    optionsSuccessStatus: 204,
    allowedHeaders: ["Content-Type", "Authorization"],
  }
));

app.use(session(
  {
    secret: 'keyboard cat',
    saveUninitialized: false, // Dont create sessions untill something is stored
    resave: false, // dont save session if unmodified
    store: MongoStore.create({
      mongoUrl: process.env.ATLAS_URI
    })
  }
));

const dbo = require("./db/conn");

app.use(express.json());

// FIXME: Remove
//app.use(require("./routes/test_routes.js"));

app.use(require("./routes/bankRoutes.js"));
app.use(require("./routes/customerRoutes.js"));
app.use(require("./routes/employeeRoutes.js"));



const port = process.env.PORT;

app.listen(port, () => {
  dbo.connectToServer(function(err) {
    if (err) {
      console.err(err);
    }
  });
  console.log(`server is running on port ${port}`)
});