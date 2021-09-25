import { AddUserToTeam, AddManagerToTeam } from "./helpers/graphql.js" 
import fetch from "node-fetch" // Asco
import { readFileSync} from "fs"

globalThis.fetch = fetch

async function teamSync() {

    console.log("Let's do it");
    console.log(process.env.INPUT_FILE);

    let rawdata = readFileSync(process.env.INPUT_FILE);
    let userInfo = JSON.parse(rawdata);
    console.log(userInfo);

    const teamInfo = [];
    const map = new Map();

    userInfo.forEach(async (user) =>  {

        // Debug
        console.log(`Adding ${user.email} to team ${user.teamName}...`);

        // Add the user to the team
        AddUserToTeam(user.email, user.teamName, true);

        // Compile a unique list of Team Managers + Team Names
        if (!map.has(user.teamName)) {
            map.set(user.teamName, true);
            teamInfo.push({
                name: user.teamName,
                manager: user.manager
            });
        }
    });

    teamInfo.forEach(async (team) => {
        // Debug
        console.log(`Will add ${team.manager} as Manager of ${team.name}...`);

        // Add the manager to the team
        AddManagerToTeam(team.manager, team.name, true);

    });

}

// And, hello.
teamSync();