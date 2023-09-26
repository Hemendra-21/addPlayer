const express = require("express");
const app = express();
app.use(express.json());
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const dbPath = path.join(__dirname, "cricketTeam.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3001, () => {
      console.log("server running successfully at https://localhost:3001/");
    });
  } catch (e) {
    console.log(`DB error ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

//Get list of players
app.get("/players/", async (request, response) => {
  const getAllPlayersQuery = `
    SELECT
     *
     FROM
     cricket_team`;

  const allPlayers = await db.get(getAllPlayersQuery);
  response.send(allPlayers);
});

//add new player

app.post("/players/", async (request, response) => {
  const playerData = request.body;

  const { player_name, jersey_number, role } = playerData;

  const addPlayerQuery = `
    INSERT INTO
    cricket_team(player_name, jersey_number, role)
    VALUES(
        ${player_name},
        ${jersey_number},
        ${role}
    );`;

  const dbResponse = await db.run(addPlayerQuery);
  response.send("Player Added to Team");
  console.log(dbResponse);
});
