const PORT = process.env.PORT || 8000;
import express from "express";
import pj from "../package.json" assert { type: "json" };
import db from "./db/connection.js";

const app = express();

const middleware = (req, res, next) => {
  const { team, year } = req.params;
  if (+year < 1977 || +year > 2022) {
    console.log(`Invalid Request: ${year}-${team}`);
    return res.status(400).send({
      error: `Invalid Request: The year '${year}' is out of scope. Valid years range from 1977 to 2022, post NBA-ABA Merger.`,
    });
  }
  next();
};

app.get("/", (req, res) => {
  res.json("Welcome to my NBA Data API");
});

app.get("/v1/nba/ping", (req, res) => {
  res.sendStatus(200);
});

app.get("/v1/nba/version", (req, res) => {
  res.send(pj.version).status(200);
});

app.get("/v1/nba/:team/:year", middleware, async (req, res, next) => {
  const team = req.params.team;
  const year = req.params.year;

  let collection = db.collection("nba-1977-2022");
  let results = await collection.findOne(
    { [`${team}.${year}`]: { $exists: true } },
    { projection: { _id: 0, [`${team}.${year}`]: 1 } }
  );

  if (!results) {
    return next(new Error(`The '${year} ${team}' was not found.`));
  }
  console.log(`FOUND: ${year}-${team}`);

  res.send(results).status(200);
});

app.get("/v1/nba/:team/:year/roster", middleware, async (req, res, next) => {
  const team = req.params.team;
  const year = req.params.year;

  let collection = db.collection("nba-1977-2022");
  let results = await collection.findOne(
    { [`${team}.${year}`]: { $exists: true } },
    { projection: { _id: 0, [`${team}.${year}.Roster`]: 1 } }
  );

  if (!results) {
    return next(new Error(`The '${year} ${team}' was not found.`));
  }
  console.log(`FOUND: ${year}-${team} Roster`);

  res.send(results).status(200);
});

app.get("/v1/nba/:team/:year/schedule", middleware, async (req, res, next) => {
  const team = req.params.team;
  const year = req.params.year;

  let collection = db.collection("nba-1977-2022");
  let results = await collection.findOne(
    { [`${team}.${year}`]: { $exists: true } },
    { projection: { _id: 0, [`${team}.${year}.Schedule`]: 1 } }
  );

  if (!results) {
    return next(new Error(`The '${year} ${team}' was not found.`));
  }
  console.log(`FOUND: ${year}-${team} Schedule`);

  res.send(results).status(200);
});

// error handler
app.use(function (err, req, res, next) {
  console.log(`API ERROR: ${err.message ?? err}`);
  const status = err.message.includes("was not found.") ? 404 : 500;
  res.status(status).json({
    error: err.message,
  });
});

app.listen(PORT, () => console.log(`server running on ${PORT}`));
