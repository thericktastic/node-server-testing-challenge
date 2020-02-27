# Creating from scratch

<!-- Initialize package.json file -->
> npm init --y

<!-- "test": "jest --watch" is important for testing -->
<!-- "server": "nodemon index.js" is important for development -->
<!-- "start": "node index.js" is important for deploying to sites like Heroku -->

- make sure there's a script for:
    "test": "jest --watch",
    "server": "nodemon index.js",
    "start": "node index.js" 

- in body of package.json, for testing:
    "jest": {
    "testEnvironment": "node"
  }
  
<!-- Install dependencies -->

> npm i express
> npm i helmet
> npm i cors
> npm i knex
> npm i sqlite3
> npm i dotenv
> npm i bcryptjs
> npm i nodemon
> npm i pg
> npm i -D jest
> npm i -D supertest

> touch .env

<!-- Initialize knex file -->
> knex init

- change connection: { filename: "./path/to/dbfile.db3" } to destination/location of database file
- add useNullAsDefault: true
- optional: add migrations and seeds directories
    migrations: {
      directory: "./data/database/migrations"
    },
    seeds: {
      directory: "./data/database/seeds"
    }


# CREATE server.js FILE
<!-- test GET endpoint after this -->
> touch server.js

// import express
const express = require("express");

// import routers

// create a server named "server" by calling the express function
const server = express();

// use routers

// set up initial route to test if server is live
server.get("/", (req, res) => {
  res.json({ api: "leggggooo!!!" });
});

// export server for use in index.js
module.exports = server;


# CREATE index.js FILE
> touch index.js

const server = require("./server.js");

const port = process.env.PORT || 6000;

server.listen(port, () => {
  console.log(`\n*** Running on port: ${port} ***\n`);
});


# SET UP MIDDLEWARE
<!-- in this instance, the middleware resides in its own .js file and is exported for use -->
const express = require("express");
const helmet = require("helmet");
const cors = require("cors"); 

module.exports = server => {
    server.use(helmet());
    server.use(express.json());
    server.use(cors());
}

<!-- if cookies/sessions are being used, don't forget the following -->
> npm i express-sesssion
> npm i connect-session-knex

const knex = require("../database/dbConfig.js");

const sessionConfig = {
  name: "session-cookie",
  secret: "dont show it to anyone",
  resave: false, //
  saveUninitialized: true, // related to GDPR compliance - front end application should prompt user to let them know cookies are used and allow user to decide whether or not cookies are ok
  cookie: {
    // now that the user has said yes to cookies, how long do we allow the user's cookie to last
    // even with a good cookie, the server can still bounce you out if the session ends or is destroyed
    maxAge: 1000 * 60 * 10,
    secure: false, // should be true in production
    httpOnly: true // true means JS can't touch the cookie - important because browser extensions run on JS, so we don't want vulnerabilities to be introduced by allowing JS to interact with the cookie
  },
  store: new KnexStore({
    // this library sits between the session library and whatever storage mechanism I'm using
    knex, // same as knex: knex, referring to the importing of dbConfig.js
    tablename: "sessions",
    createTable: true, // if "tablename: sessions" doesn't exist, this line gives permission to create it
    sidfieldname: "sid", // name of column for session id = sid
    clearInterval: 1000 * 60 * 10 // every 10 minutes, check to see if any sessions have expired
  })
};

module.exports = server => {
  server.use(helmet());
  server.use(express.json());
  server.use(cors());
  server.use(session(sessionConfig)); // turns on the session middleware
  // at this point there is a req.session object created by express-session
};


# CREATE MIGRATIONS FILE

> knex migrate:make create_db_file

<!-- build out migration file -->
exports.up = function(knex) {
  return knex.schema.createTable("users", users => {
    users.increments();

    users
      .string("username", 128)
      .notNullable()
      .unique();

    users.string("password", 128).notNullable();

    users.string("department", 218).notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists("users");
};


<!-- make sure the exports.down command is the opposite of exports.up -->

> knex migrate:latest

# CREATE dbConfig.js FILE IN .db3 DIRECTORY

const knex = require("knex");

const configOptions = require("../knexfile.js").development;

module.exports = knex(configOptions);

<!-- Next, we set up a basic router to verify we have access to the database -->

# SET UP ROUTER FOR TESTING DATABASE FILE

const router = require("express").Router();

const Users = require("./users-model.js");

const db = require("../data/dbConfig.js");

router.get("/", (req, res) => {
  Users.find()
    .then(users => {
      console.log("This is users in router.get(users): ", users);
      res.json(users);
    })
    .catch(error => {
      console.log("This is error in router.get(users): ", error);
      res.status(500).json({ error: "Error retrieving users" });
    });
});

module.exports = router;

<!-- To accomplish the next step, the code above will need changing -->
<!-- No db import, no reference to db in the router.get -->

# SET UP USERS MODEL SO API ROUTER CAN ACCESS USERS DATABASE

const db = require("../data/dbConfig.js");

module.exports = {
  add,
  find,
  findBy,
  findById
};

function add(user) {
  return db("users")
    .insert(user, "id")
    .then(ids => {
      const [id] = ids;
      return findById(id);
    });
}

function find() {
  return db("users").select("id", "username", "password", "department");
}

function findBy(filter) {
  return db("users")
    .select("id", "username", "password", "department")
    .where(filter);
}

function findById(id) {
  return db("users")
    .select("id", "username", "password", "department")
    .where({ id })
    .first();
}

# SET UP AUTHENTICATION ROUTER

const bcrypt = require("bcryptjs");
const router = require("express").Router();

// import users-model so api-router can access database
const Users = require("../users/users-model.js");

// registration endpoint
router.post("/register", (req, res) => {
  let user = req.body;

  const hash = bcrypt.hashSync(user.password, 8);

  user.password = hash;

  Users.add(user)
    .then(savedUser => {
      res.status(201).json(savedUser);
    })
    .catch(error => {
      console.log("This is error in router.post(/register): ", error);
      res.status(500).json({ error: "Error registering" });
    });
});

module.exports = router;

# set up API router

const router = require("express").Router();

// import routers
const authRouter = require("../auth/auth-router.js");
const usersRouter = require("../users/users-router.js");

// import middleware
// const restricted = require("../auth/restricted-middleware.js");

// call routers and implement middleware
router.use("/auth", authRouter);
router.use("/users", usersRouter);

module.exports = router;



# SET UP RESTRICTED MIDDLEWARE

<!-- set up restricted middleware to verify user has authentication -->
<!-- can use bcrypt, cookies/sessions, or JSON Web Tokens -->

<!-- bcrypt -->
const bcrypt = require("bcryptjs");

const Users = require("../users/users-model.js");

module.exports = (req, res, next) => {
  let { username, password } = req.headers;

  if (username && password) {
    Users.findBy({ username })
      .first()
      .then(user => {
        if (user && bcrypt.compareSync(password, user.password)) {
          next();
        } else {
          res.status(401).json({ message: "You shall not pass!" });
        }
      })
      .catch(({ name, message, stack }) => {
        // error is destructured into name, message, and stack
        res.status(500).json({ name, message, stack });
      });
  } else {
    res.status(400).json({ error: "You shall not pass!" });
  }
};

<!-- cookies/sessions -->
module.exports = (req, res, next) => {
  if (req.session && req.session.loggedIn) {
    next();
  } else {
    res.status(401).json({ you: "shall not pass!" });
  }
};

<!-- JWT, part 1 - restricted-middleware.js -->
> npm i jsonwebtoken
const jwt = require("jsonwebtoken"); // import this first

// destructured from 
const { jwtSecret } = require("../config/secrets.js");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (authorization) {
    jwt.verify(authorization, jwtSecret, (err, decodedToken) => {
      if (err) {
        res.status(401).json({ message: "Invalid Credentials" });
      } else {
        req.decodedToken = decodedToken;
        next();
      }
    });
  } else {
    res.status(400).json({ message: "No credentials provided" });
  }
};

<!-- JWT, part 2 - secrets.js file-->
module.exports = {
    jwtSecret: process.env.JWT_SECRET || "is it secret, is it in a safe?"
}

# CREATE LOGIN ENDPOINT