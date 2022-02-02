

export const ADD_TEAM = `
    mutation($myTeamInput: AddTeamInput!) {
        addTeam(input: $myTeamInput) {
            id
            name
            description
        }
    }`;

export const ADD_TEAM_MEMBER = `
    mutation($myTeamMemberInput: AddTeamMemberInput!) {
        addTeamMember(input: $myTeamMemberInput) {
            teamId
            userId
        }
    }`;

export const ADD_TEAM_MANAGER = `
    mutation($myTeamManagerInput: AddTeamManagerInput!) {
        addTeamManager(input: $myTeamManagerInput) {
            teamId
            userId
            permissionLevel
        }
    }`;

export const INVITE_MANAGER = `
    mutation($myManagerInput: InviteManagerInput!) {
        inviteManager(input :$myManagerInput) {
        id,
        email,
        sendDate
        }
    }`;