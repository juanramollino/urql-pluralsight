"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.INVITE_MANAGER = exports.ADD_TEAM_MANAGER = exports.ADD_TEAM_MEMBER = exports.ADD_TEAM = void 0;
exports.ADD_TEAM = "\n    mutation($myTeamInput: AddTeamInput!) {\n        addTeam(input: $myTeamInput) {\n            id\n            name\n            description\n        }\n    }";
exports.ADD_TEAM_MEMBER = "\n    mutation($myTeamMemberInput: AddTeamMemberInput!) {\n        addTeamMember(input: $myTeamMemberInput) {\n            teamId\n            userId\n        }\n    }";
exports.ADD_TEAM_MANAGER = "\n    mutation($myTeamManagerInput: AddTeamManagerInput!) {\n        addTeamManager(input: $myTeamManagerInput) {\n            teamId\n            userId\n            permissionLevel\n        }\n    }";
exports.INVITE_MANAGER = "\n    mutation($myManagerInput: InviteManagerInput!) {\n        inviteManager(input :$myManagerInput) {\n        id,\n        email,\n        sendDate\n        }\n    }";
