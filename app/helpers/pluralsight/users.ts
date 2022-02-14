import { initClient } from "../graphql";
import * as queries from "../queries"

type UserInfo = {
    id: string,
    name: string
};

/**
 * Returns user information.
 * @param {string} email e-mail address of the user
 * @returns a JSON object with the user information. Or null if the user cannot be found.
 */
 export async function getUserByEmail(email : string) : Promise<UserInfo>{
    var client = initClient();
    const query = queries.GET_USER_BY_EMAIL_QUERY;
    const variables = { "myUserFilter" : { "emails" : email } };

    console.log(variables);
    
    var queryResult : UserInfo = { id: "", name: ""};

    // Executes the GraphQL query against the server to get the matching user.
    await client
        .query(query, variables)
        .toPromise()
        .then(result => {
            // Debug stuff
            console.log("[getUserByEmail] ", result);

            //var nodes = result.data.users.nodes;
            //console.log(nodes);
            //if (!nodes || nodes.length > 1)
            //    throw 'Multiple or no nodes returned.';



            // Set the return value.
            //queryResult = result.data.users.nodes[0];
        })
        .catch(error => {
            console.log("Something bad has happened when trying to get an user by e-mail.");
            console.log(error);
        });

    return(queryResult);
}