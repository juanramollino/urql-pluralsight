// import fetch from "node-fetch" // Asco
import { captureRejectionSymbol } from "events";
import { lchmod, readFileSync } from "fs";
import { stringify } from "querystring";
import { addUserToTeam, addManagerToTeam } from "./helpers/graphql";
import {
  createTeam,
  getTeamInfo,
  teamExists,
} from "./helpers/pluralsight/teams";

//globalThis.fetch = fetch

type SourceTeamInfo = {
  email: string;
  teamName: string;
  manager: string;
};

type SourceTeamAndManager = {
  name: string;
  manager: string;
};

async function teamSync() {
  const inputFile: string = process.env.INPUT_FILE || "input/mini-test.json";

  console.log("Let's do it");
  console.log(inputFile);

  let rawdata = readFileSync(inputFile);
  let usersAndTeams: [SourceTeamInfo] = JSON.parse(rawdata.toString());

  // Build a set just with Team Names (to create them)
  const justTeams: Set<string> = new Set(
    usersAndTeams.map((x: SourceTeamInfo) => x.teamName)
  );

  // Build a set with Team Names + Managers
  const teamsAndManagers: Set<SourceTeamAndManager> = new Set(
    usersAndTeams.map((x: SourceTeamInfo) => {
      let s: SourceTeamAndManager = {
        manager: x.manager,
        name: x.teamName,
      };
      return s;
    })
  );

  // Create all Teams, if they don't exist.
  createAllTeams(justTeams).then((_) => {
    addAllTeamManagers(teamsAndManagers);
    addAllTeamMembers(usersAndTeams);
  });
}

async function createAllTeams(teamNames: Set<string>): Promise<void> {
  console.log("[create-all-teams] Starting...");
  teamNames.forEach((teamName: string) => {
    Promise.resolve(teamExists(teamName)).then((exists) => {
      if (!exists) createTeam(teamName);
    });
  });
  console.log("[create-all-teams] Done.");
}

function addAllTeamManagers(teamsAndManagers: Set<SourceTeamAndManager>) {
  console.log("[add-team-managers] Starting... ");
  teamsAndManagers.forEach((team: SourceTeamAndManager) => {
    addManagerToTeam(team.manager, team.name);
  });
  console.log("[add-team-managers] Done.");
}

function addAllTeamMembers(usersAndTeams: [SourceTeamInfo]) {
  console.log("[add-all-team-members] Starting...");
}

// And, hello.
teamSync();

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
