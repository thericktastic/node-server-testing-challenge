const express = require("express");
const helmet = require("helmet");
const cors = require("cors");

const alliancesRouter = require("../alliances/router.js");
const countriesRouter = require("../countries/router.js");

const server = express();

// middleware
server.use(express.json());
server.use(helmet());
server.use(cors());

// routes
server.use("/api/alliances", alliancesRouter);
server.use("/api/countries", countriesRouter);

server.get("/", (req, res) => {
  res.json({ api: "up" });
});

module.exports = server;
