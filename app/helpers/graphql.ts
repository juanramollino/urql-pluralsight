import { Client, createClient } from "@urql/core";
import {
  createTeam,
  AddTeamManager,
  addTeamMember,
  getTeamInfo,
  InviteManager,
} from "./pluralsight/teams";
import { getUserByEmail } from "./pluralsight/users.js";
import * as queries from "./queries.js";
// import * as mutations from "./mutations.js";

/**
 * Initializes the GraphQLClient
 * @returns {Client} a GraphQL client (@url/core)
 */
export function initClient(): Client {
  const endpoint = process.env.PLURALSIGHT_ENDPOINT;
  const APIKey = process.env.API_KEY;

  var client = createClient({
    url: `${endpoint}`,
    fetchOptions: () => {
      const token = APIKey;
      return {
        headers: { authorization: token ? `Bearer ${token}` : "" },
      };
    },
  });

  // console.log("Client initialized.");

  return client;
}

export const getUsers = async () => {
  var client: Client = initClient();
  const query = queries.GET_USERS_QUERY;

  client
    .query(query)
    .toPromise()
    .then((result) => {
      console.log(JSON.stringify(result.data));
    });
}


// Returns a bool indicating if a Team with the name passed as parameter exists
export const teamExists = async (teamName: string) => {
  var client: Client = initClient();
  const query = queries.GET_TEAMS_BY_NAME;
  const variables = { myTeamsFilter: { name: teamName } };

  var teamExists = false;

  // Execute GraphQL query and analyze results.
  await client
    .query(query, variables)
    .toPromise()
    .then((result) => {
      var nodes = result.data.teams.nodes;
      teamExists = nodes.length == 1;

      console.log(nodes);
    });

  // Return
  return teamExists;
}

const log =
  (message: string) =>
  <Q>(arg: Q) => {
    console.log(message);
    return arg;
  };

/**
 * Adds a User to a Team using e-mail and team name as parameters.
 * @param {string} email e-mail address of the user
 * @param {string} teamName team name to be added
 */
export const addUserToTeam = async (
  email: string,
  teamName: string
) =>
  Promise.all([getUserByEmail(email), getTeamInfo(teamName)]).then(
    ([pluralsightUser, pluralsightTeam]) => {
      // DEBUG
      console.log(`- Adding user ${email} to team "${teamName}"`);

      return (
        !pluralsightTeam
          ? createTeam(teamName)
          : Promise.resolve(pluralsightTeam)
      )
        .then(log("lorem"))
        .then((pluralsightTeam) => {
          console.log("- User ID from PS: ", pluralsightUser.id);
          console.log("- Team ID from PS: ", pluralsightTeam.id);

          return addTeamMember(pluralsightUser.id, pluralsightTeam.id);
        });
    }
  );

/**
 * Adds a Team Manager to the Team using the supplied manager's e-mail address and team name.
 * If the Team Manager does not exist
 * @param {string} managerEmail Manager e-mail address
 * @param {string} teamName Team name
 * @param {boolean} [inviteIfNotExists=false] Send an invitation if the manager does not exists
 */
export async function addManagerToTeam(
  managerEmail: string,
  teamName: string,
  inviteIfNotExists: boolean = false
) {
  var managerInfo = await getUserByEmail(managerEmail);
  var teamInfo = await getTeamInfo(teamName);

  // DEBUG
  console.log(
    `[AddManagerToTeam] Adding ${managerEmail} as manager of team "${teamName}"`
  );

  // If the team exists
  if (teamInfo) {
    // If the manager exists
    if (managerInfo) {
      console.log(managerInfo);
      console.log(teamInfo);
      AddTeamManager(managerInfo.id, teamInfo.id);
    } else {
      if (inviteIfNotExists) {
        // If the manager is new, invite them.
        // InviteTeamManager()
        console.log("Manager Info not found. New Manager :", managerEmail);
        InviteManager(managerEmail, teamInfo.id);
      }
    }
  }
}
