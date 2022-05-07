const PORT = process.env.PORT || 8000
const express = require('express')
const axios = require('axios')

const fs = require('fs');

const data = fs.readFileSync('allTeamData.json');
const elements = JSON.parse(data);

const app = express();

app.get('/', (req, res) => {
    res.json('Welcome to my NBA Data API')
})

app.get('/elements', alldata);
function alldata(req, res) {
    res.send(elements);
}

app.get('/elements/:element/', searchTeam);
function searchTeam(req, res) {
    const team = req.params.element;
    const reply = elements[team] ? elements[team] : { status: "Not Found" };
    res.send(reply);
}

app.get('/elements/:team/:year', searchTeamYear);
function searchTeamYear(req, res) {
    const team = req.params.team;
    const year = req.params.year;
    const reply = elements[team] ? elements[team][year] : { status: "Not Found" };
    res.send(reply);
}

app.get('/elements/:team/:year/:roster_schedule', searchTeamRosterOrSchedule);
function searchTeamRosterOrSchedule(req, res) {
    const team = req.params.team;
    const year = req.params.year;
    const roster_schedule = req.params.roster_schedule
    const reply = (elements[team] && (roster_schedule === 'Roster' || roster_schedule === 'Schedule')) ? elements[team][year][roster_schedule] : { status: "Not Found" };
    res.send(reply);
}

app.listen(PORT, () => console.log(`server running on ${PORT}`))
