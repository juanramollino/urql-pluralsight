import { createClient } from "@urql/core";
import { AddTeam, AddTeamManager, AddTeamMember, GetTeamInfo, InviteManager } from "./pluralsight/teams.js";
import { getUserByEmail } from "./pluralsight/users.js";
import * as queries from "./queries.js";
// import * as mutations from "./mutations.js";

/**
 * Initializes the GraphQLClient
 * @returns a GraphQL client (@url/core)
 */
export function initClient() {
    const endpoint = process.env.PLURALSIGHT_ENDPOINT;
    const APIKey = process.env.API_KEY;

    var client = createClient({    
        url: `${endpoint}`,
        fetchOptions: () => {
            const token = APIKey;
            return {
              headers: { authorization: token ? `Bearer ${token}` : '' },
            };
          },
    });

    // console.log("Client initialized.");

    return client;
}

export function getUsers() {
    var client = initClient();
    const query = queries.GET_USERS_QUERY;

    client
        .query(query)
        .toPromise()
        .then(result => {
            console.log(JSON.stringify(result.data));
        });
}



// Returns a bool indicating if a Team with the name passed as parameter exists
export async function teamExists(teamName) {
    var client = initClient();
    const query = queries.GET_TEAMS_BY_NAME;
    const variables = { "myTeamsFilter" : { "name" : teamName } };

    var teamExists = false;

    // Execute GraphQL query and analyze results.
    await client
        .query(query, variables)
        .toPromise()
        .then(result => {
            var nodes = result.data.teams.nodes;
            teamExists =  (nodes.length == 1);

            console.log(nodes);
        });

    // Return
    return teamExists;
}




/**
 * Adds a User to a Team using e-mail and team name as parameters.
 * @param {string} email e-mail address of the user
 * @param {string} teamName team name to be added
 * @param {boolean} [createTeam=true] flag indicating if the team should be created if it does not exist
 */
export async function AddUserToTeam(email, teamName, createTeam = true) {

    // Obtain Pluralsight user ID
    var pluralsightUser = await getUserByEmail(email);

    // Does the Team Exist? If not, get ID and create
    var pluralsightTeam = await GetTeamInfo(teamName);

    // DEBUG
    console.log(`- Adding user ${email} to team "${teamName}"`);

    if (!pluralsightTeam && createTeam) {
        // Create the team.
        console.log("   (Creating team ", teamName, "...");
        pluralsightTeam = await AddTeam(teamName);
        // console.log(teamInfo);
    }

    // If the team did not exist and did not get created, do nothing.
    // Otherwise, add the user to the team.
    if (pluralsightTeam) {
        // Add the user to the team.
        console.log("- User ID from PS: ", pluralsightUser.id);
        console.log("- Team ID from PS: ", pluralsightTeam.id);

        AddTeamMember(pluralsightUser.id , pluralsightTeam.id);

    }

}

/**
 * Adds a Team Manager to the Team using the supplied manager's e-mail address and team name.
 * If the Team Manager does not exist
 * @param {string} managerEmail Manager e-mail address
 * @param {string} teamName Team name
 * @param {boolean} [inviteIfNotExists=false] Send an invitation if the manager does not exists
 */
export async function AddManagerToTeam(managerEmail, teamName, inviteIfNotExists = false)
{
    var managerInfo = await getUserByEmail(managerEmail);
    var teamInfo = await GetTeamInfo(teamName);

    // DEBUG
    console.log(`[AddManagerToTeam] Adding ${managerEmail} as manager of team "${teamName}"`);

    // If the team exists
    if (teamInfo) {

        // If the manager exists
        if (managerInfo) {
            console.log(managerInfo);
            console.log(teamInfo);
            AddTeamManager(managerInfo.id, teamInfo.id);
        }
        else {
            if (inviteIfNotExists)
            {
                // If the manager is new, invite them.
                // InviteTeamManager()
                console.log("Manager Info not found. New Manager :", managerEmail);
                InviteManager(managerEmail, teamInfo.id);
            }
            
        }
    }
}