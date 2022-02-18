import { initClient } from "../graphql";
import * as queries from "../queries";
import * as mutations from "../mutations";
import { Client } from "@urql/core";
// import { collectTypesFromResponse } from "@urql/core/dist/types/utils";

/**
 * Adds a Team Manager to the Team using the provided ID's.
 * @param {string} userId String representing the User Id of the Manager (should exist)
 * @param {string} teamId String representing the Team Id
 */
export async function addTeamManager(userId: string, teamId: string) {
  var client: Client = initClient();
  const mutation = mutations.ADD_TEAM_MANAGER;
  const variables = {
    myTeamManagerInput: {
      teamId: teamId,
      userId: userId,
      permissionLevel: "LIMITED",
    },
  };

  return client
    .mutation(mutation, variables)
    .toPromise()
    .then((result) => {
      if (result.error) {
        // TODO: Improve all of this logic.
        console.error(
          "[Add Team Manager] An error occured when adding a manager to a team."
        );
        console.log(result.error);
      } else {
        // Do I want to save this payload? Who knows.
        /*teamInfo = {
          teamId: result.data.addTeamManager.teamId,
          userId: result.data.addTeamManager.userId,
          permissionLevel: result.data.addTeamManager.permissionLevel;
        };*/
        // console.debug("[Add Team Manager] Everything went fine.");
      }
    })
    .catch((error) => {
      console.error(
        "[Add Team Manager] Something very bad occured when trying to add a member to a team"
      );
      console.log(error);
    });
}

/**
 * Adds a new Team to Pluralsight by name
 * @param {string} name Name of the new Team
 * @param {string} [desciption=""] Desciption of the new Team (unused)
 * @returns a JSON element with the team information
 */
export async function createTeam(
  name: string,
  desciption: string = ""
): Promise<AddTeamPayload> {
  var client: Client = initClient();
  const mutation = mutations.ADD_TEAM;
  const variables = { myTeamInput: { name: name } };
  var addTeamPayload: AddTeamPayload = { id: "", name: "" };

  // DEBUG
  console.log(`[Create Team] Adding team ${name}`);
  // console.log(variables);

  // Execute GraphQL mutation to add the team
  // Should check for existence? Maybe
  await client
    .mutation(mutation, variables)
    .toPromise()
    .then((result) => {
      // DEBUG
      // console.log(result);

      if (result.error) {
        // Most likely, the team already exists.
        // TODO: Improve all of this logic.
        console.error(result.error);
      } else {
        console.log(result.data);
        console.log(result.data.addTeam);
        addTeamPayload = {
          id: result.data.addTeam.id,
          name: result.data.addTeam.name,
        };
      }
    })
    .catch((error) => {
      // I don't think this works.
      console.log("Error occured when trying to add a team");
      console.log(error);
    });

  return addTeamPayload;
}

/**
 * Adds a Member to a Team based on their Ids
 * @param {string} userId String representing the Pluralsight User Id
 * @param {string} teamId String representing the Pluralsight Team Id
 */
export async function addTeamMember(userId: string, teamId: string) {
  var client: Client = initClient();
  const mutation = mutations.ADD_TEAM_MEMBER;
  const variables = { myTeamMemberInput: { teamId: teamId, userId: userId } };

  // Execute GraphQL mutation to add the team
  // Should check for existence? Maybe
  await client
    .mutation(mutation, variables)
    .toPromise()
    .then((result) => {
      // DEBUG
      // console.log("Add Team Member query executed!");
      // console.log(result);

      if (result.error) {
        // Most likely, the team already exists.
        // TODO: Improve all of this logic.
        console.log(result.error);
        //teamInfo = null;
      } else {
        /*teamInfo = {
                    "id" : result.data.addTeam.id ,
                    "name" : result.data.addTeam.name
                };*/
        // DEBUG
        // console.log(teamInfo);
      }
    })
    .catch((error) => {
      // I don't think this works.
      console.log("Error occured when trying to add a member to a team");
      console.log(error);
    });
}

/**
 * Obtains Team informataion based on the team name supplied as parameter.
 * @param {string} teamName Team Name
 * @returns a JSON object with the Team information
 */
export async function getTeamInfo(
  teamName: string
): Promise<AddTeamPayload | undefined> {
  var client: Client = initClient();
  const query = queries.GET_TEAMS_BY_NAME;
  const variables = { myTeamsFilter: { name: teamName } };

  var teamInfo: AddTeamPayload = { id: "", name: "" };

  console.log(`[GetTeamInfo] Searching for team ${teamName}`);

  // Execute GraphQL query and analyze results.
  return client
    .query(query, variables)
    .toPromise()
    .then((result) => {
      var nodes: AddTeamPayload[] = result.data.teams.nodes;

      // DEBUG to check result count.
      console.log(`[Get team info] Obtained ${nodes.length} Teams`);

      // Need to further filter by Team Name because the API uses patterns to filter by name.
      var finalists = nodes.filter((team) => team.name == teamName);

      switch (true) {
        case finalists.length > 1:
          // This should never happen.
          throw "[Get team info] Got two or more teams and couldn't parse them.";
          break;
        case finalists.length == 1:
          // If an exact match is found, return that team info.
          console.log("[Get team info] Team found");
          teamInfo = finalists[0];
          console.log(teamInfo);
          return teamInfo;

          break;
        default:
          return undefined;
          break;
      }
    })
    .catch((error) => {
      console.log(error);
      return undefined;
    });
}

/**
 *
 * @param managerEmail
 * @param teamId
 */
export async function inviteManager(managerEmail: string, teamId: string) {
  var client: Client = initClient();
  const mutation = mutations.INVITE_MANAGER;
  const variables = {
    myManagerInput: {
      email: managerEmail,
      teamId: teamId,
      shouldConsumeLicense: false,
      permissionSetId: process.env.MANAGER_PERMISSION_SET_ID,
    },
  };

  // Execute GraphQL mutation to add the team
  // Should check for existence? Maybe
  await client
    .mutation(mutation, variables)
    .toPromise()
    .then((result) => {
      // DEBUG
      console.log(result);

      if (result.error) {
        // Most likely, the team already exists.
        // TODO: Improve all of this logic.
        console.log(result.error);
        //teamInfo = null;
      } else {
        /*teamInfo = {
                    "id" : result.data.addTeam.id ,
                    "name" : result.data.addTeam.name
                };*/

        console.log(result.data);

        // DEBUG
        // console.log(teamInfo);
      }
    })
    .catch((error) => {
      // I don't think this works.
      console.log("Error occured when trying to add a member to a team");
      console.log(error);
    });
}

// Returns a bool indicating if a Team with the name passed as parameter exists
export const teamExists = async (teamName: string) => {
  var client: Client = initClient();
  const query = queries.GET_TEAMS_BY_NAME;
  const variables = { myTeamsFilter: { name: teamName } };

  var teamExists = false;

  // Execute GraphQL query and analyze results.
  return await client
    .query(query, variables)
    .toPromise()
    .then((result) => {
      var nodes = result.data.teams.nodes;
      teamExists = nodes.length == 1;

      // DEBUG
      console.debug(`[team-exists] ${teamName} -> ${teamExists} ]`);

      // console.log(nodes);
      return teamExists;
    });
};
