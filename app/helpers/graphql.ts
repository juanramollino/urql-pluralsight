import { Client, createClient } from "@urql/core";
import {
  createTeam,
  addTeamManager,
  addTeamMember,
  getTeamInfo,
  inviteManager,
} from "./pluralsight/teams";
import { getUserByEmail } from "./pluralsight/users";
import * as queries from "./queries";
import fetch from "isomorphic-unfetch";

/**
 * Initializes the GraphQLClient
 * @returns {Client} a GraphQL client (@url/core)
 */
export function initClient(): Client {
  const endpoint = process.env.PLURALSIGHT_ENDPOINT;
  const APIKey = process.env.API_KEY;

  var client = createClient({
    url: `${endpoint}`,
    fetch: fetch,
    fetchOptions: () => {
      const token = APIKey;
      return {
        headers: { authorization: token ? `Bearer ${token}` : "" },
      };
    },
  });

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
};

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
export const addUserToTeam = async (email: string, teamName: string) =>
  Promise.all([getUserByEmail(email), getTeamInfo(teamName)]).then(
    ([pluralsightUser, pluralsightTeam]) => {
      // DEBUG
      /*(console.log(
        `[add-user-to-team] Adding user ${email} to team "${teamName}"`
      );*/

      if (!pluralsightUser) throw `[add-user-to-team] User ${email} not found.`;

      if (!pluralsightTeam)
        throw "[add-user-to-team] Something went really wrong when checking/creating a team";

      console.log(`[add-user-to-team] User name : ${pluralsightUser.name}`);
      console.log(`[add-user-to-team] Team name : ${pluralsightTeam?.name}`);

      return Promise.resolve(pluralsightTeam)
        .then(log("lorem"))
        .then((pluralsightTeam) => {
          //log(`[add-user-to-team] User ID from PS: ${pluralsightUser.id}`);
          //log(`[add-user-to-team] Team ID from PS: ${pluralsightTeam.id}`);

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
  Promise.all([getUserByEmail(managerEmail), getTeamInfo(teamName)]).then(
    ([managerInfo, teamInfo]) => {
      // DEBUG
      console.log(
        `[AddManagerToTeam] Adding ${managerEmail} as manager of team "${teamName}"`
      );

      // If the team does not exists... Exception or error?
      if (!teamInfo) {
        console.error("Team does not exist");
        return;
      }

      // If the manager exists
      if (managerInfo) {
        console.log(managerInfo);
        console.log(teamInfo);
        addTeamManager(managerInfo.id, teamInfo.id);
      } /*else {
        if (inviteIfNotExists) {
          // If the manager is new, invite them.
          // InviteTeamManager()
          console.log("Manager Info not found. New Manager :", managerEmail);
          InviteManager(managerEmail, teamInfo.id);
        }
      }*/
    }
  );
}
