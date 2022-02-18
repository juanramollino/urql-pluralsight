// import fetch from "node-fetch" // Asco
// import { captureRejectionSymbol } from "events";
import { readFileSync } from "fs";
// import { stringify } from "querystring";
import { addUserToTeam, addManagerToTeam } from "./helpers/graphql";
import {
  addTeamMember,
  createTeam,
  getTeamInfo,
  teamExists,
} from "./helpers/pluralsight/teams";

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
  createAllTeams(justTeams).then((teams: Array<string>) => {
    if (teams.length > 0) {
      addAllTeamManagers(teamsAndManagers);
      addAllTeamMembers(usersAndTeams);
    }
  });
}

/**
 * Create all Teams in Plurlsight
 * @param teamNames
 */
async function createAllTeams(teamNames: Set<string>): Promise<Array<string>> {
  console.log("[create-all-teams] Starting...");

  let teamsCreated: Array<string> = [];

  teamNames.forEach((teamName: string) => {
    teamExists(teamName).then((exists) => {
      if (!exists)
        createTeam(teamName).then((t?: AddTeamPayload) => {
          if (t) {
            console.log(`[create-all-teams] ${t?.name} Team created.`);
            teamsCreated.push(t.name);
          } else
            console.log(
              `[create-all-teams] Something went wrong creating ${teamName}`
            );
        });
    });
  });

  console.log("[create-all-teams] Done.");

  return teamsCreated;
}

/**
 * Adds all team managers to their corresponding teams.
 * @param teamsAndManagers
 */
function addAllTeamManagers(teamsAndManagers: Set<SourceTeamAndManager>) {
  console.log("[add-team-managers] Starting... ");
  teamsAndManagers.forEach((team: SourceTeamAndManager) => {
    addManagerToTeam(team.manager, team.name);
  });
  console.log("[add-team-managers] Done.");
}

/**
 * Adds all team members to their corresponding teams.
 * @param usersAndTeams
 */
function addAllTeamMembers(usersAndTeams: [SourceTeamInfo]) {
  console.log("[add-all-team-members] Starting...");
  usersAndTeams.forEach((memberInfo: SourceTeamInfo) => {
    addUserToTeam(memberInfo.email, memberInfo.teamName);
  });
  console.log("[add-all-team-members] Done.");
}

// And, hello.
teamSync();
