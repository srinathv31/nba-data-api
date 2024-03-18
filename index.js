const PORT = process.env.PORT || 8000;
const express = require("express");

const fs = require("fs");

const data = fs.readFileSync("allTeamData.json");
const elements = JSON.parse(data);

const app = express();

const middleware = (req, res, next) => {
  console.log(req.params);
  const { team, year } = req.params;
  if (!elements[team] || !elements[team][year]) {
    return res.status(404).send({
      error: `The '${year} ${team}' was not found.`,
      status: 404,
    });
  }
  next();
};

app.get("/", (req, res) => {
  res.json("Welcome to my NBA Data API");
});

app.get("/v1/nba/:team/:year", middleware, searchTeamYear);
function searchTeamYear(req, res) {
  const team = req.params.team;
  const year = req.params.year;
  const reply = elements[team][year];
  res.send(reply);
}

app.get(
  "/v1/nba/:team/:year/:roster_schedule",
  middleware,
  searchTeamRosterOrSchedule
);
function searchTeamRosterOrSchedule(req, res) {
  const team = req.params.team;
  const year = req.params.year;
  const roster_schedule = req.params.roster_schedule;
  const reply = elements[team][year][roster_schedule];
  res.send(reply);
}

// error handler
app.use(function (err, req, res, next) {
  res.status(500).json({
    error: err.message,
  });
});

app.listen(PORT, () => console.log(`server running on ${PORT}`));
