

export const GET_USERS_QUERY = `
    query getUsers {
        users {
            nodes {
                id
                email
            }
        }
    }
    `;

export const GET_USER_BY_EMAIL_QUERY = `
    query GetUser($myUserFilter: UserFilter) {
        users(filter: $myUserFilter) {
            nodes {
                id
                email
                teams {
                    nodes {
                        id
                        name
                    }
                }
            }
        }
    }
    `;

export const GET_TEAMS_BY_NAME = `
    query ($myTeamsFilter: TeamsFilter) {
        teams(filter: $myTeamsFilter) {
          nodes {
            id
            name
          }
        }
      }
      
    `;
