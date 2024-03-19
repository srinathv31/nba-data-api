// !! This function was used for sorting the data properly. Not used in Production !!

const fs = require("fs");

const sample = require("./allTeamData-1.json");

const gameMap = {};

Object.entries(sample).forEach(([team, teamData]) => {
  console.log("🚀 ~ Object.values ~ team:", team);

  Object.entries(teamData).forEach(([year, yearData]) => {
    try {
      gameMap[team] = {
        ...gameMap[team],
        [year]: {},
      };
      Object.entries(yearData.Schedule.games).forEach(([gameKey, game]) => {
        yearData.Schedule.games[gameKey] = { ...game, gameKey: gameKey };
        if (gameKey.includes("P")) {
          try {
            gameMap[team][year].playoffs.push({ ...game, gameKey: gameKey });
          } catch {
            gameMap[team][year].playoffs = [{ ...game, gameKey: gameKey }];
          }
        } else {
          try {
            gameMap[team][year].regular.push({ ...game, gameKey: gameKey });
          } catch {
            gameMap[team][year].regular = [{ ...game, gameKey: gameKey }];
          }
        }
      });
      teamData[year].Schedule.games = { ...gameMap[team][year] };
    } catch (err) {
      console.log(err);
    }
  });
});

fs.writeFile("./newData.json", JSON.stringify(sample), function (err) {
  if (err) {
    return console.log(err);
  }
  console.log("The file was saved!");
});
