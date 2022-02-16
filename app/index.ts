// import fetch from "node-fetch" // Asco
import { lchmod, readFileSync } from "fs";
import { stringify } from "querystring";
import { addUserToTeam, addManagerToTeam, teamExists } from "./helpers/graphql";
import { createTeam } from "./helpers/pluralsight/teams";

//globalThis.fetch = fetch

interface UserAndTeam {
  email: string;
  teamName: string;
  manager: string;
}

async function teamSync() {
  const inputFile: string = process.env.INPUT_FILE || "input/mini-test.json";

  console.log("Let's do it");
  console.log(inputFile);

  let rawdata = readFileSync(inputFile);
  let usersAndTeams = JSON.parse(rawdata.toString());
  console.log(usersAndTeams);

  const teamInfo: Array<{ name: string; manager: string }> = [];
  const justTeams: Set<string> = new Set(
    usersAndTeams.map(
      (x: { email: string; teamName: string; manager: string }) => x.teamName
    )
  );

  // Create all Teams
  justTeams.forEach((teamName: string) => {
    Promise.resolve(teamExists(teamName)).then((exists) => {
      if (!exists) createTeam(teamName);
    });
  });

  /*
    const map = new Map();//lchmod;

    usersAndTeams.forEach(async (userAndTeam : { email : string, teamName : string , manager : string }) =>  {

        // Debug
        console.log(`Adding ${userAndTeam.email} to team ${userAndTeam.teamName}...`);

        // Add the user to the team
        addUserToTeam(userAndTeam.email, userAndTeam.teamName);

        // Compile a unique list of Team Managers + Team Names
        if (!map.has(userAndTeam.teamName)) {
            map.set(userAndTeam.teamName, true);
            teamInfo.push({
                name: userAndTeam.teamName,
                manager: userAndTeam.manager
            });
        }
    });*/

  /*
    // For each Team, make sure the correct Manager is set up.
    teamInfo.forEach(async (team) => {
        // Debug
        console.log(`Will add ${team.manager} as Manager of ${team.name}...`);

        // Add the manager to the team
        addManagerToTeam(team.manager, team.name, true);

    });
    */
}

// And, hello.
teamSync();
