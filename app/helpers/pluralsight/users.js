import { initClient } from "../graphql.js";
import * as queries from "../queries.js"

/**
 * Returns user information.
 * @param {string} email e-mail address of the user
 * @returns a JSON object with the user information. Or null if the user cannot be found.
 */
 export async function getUserByEmail(email) {
    var client = initClient();
    const query = queries.GET_USER_BY_EMAIL_QUERY;
    const variables = { "myUserFilter" : { "emails" : email } };
    
    var queryResult;

    // Executes the GraphQL query against the server to get the matching user.
    await client
        .query(query, variables)
        .toPromise()
        .then(result => {
            var nodes = result.data.users.nodes;
            if (!nodes || nodes.length > 1)
                throw 'Multiple or no nodes returned.';

            // Debug stuff
            // console.log("[getUserByEmail] ", result.data.users.nodes[0]);

            // Set the return value.
            queryResult = result.data.users.nodes[0];
        })
        .catch(error => {
            console.log("Something bad has happened when trying to get an user by e-mail.");
            console.log(error);
        });

    // console.log("Bye");
    return(queryResult);
}