"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET_TEAMS_BY_NAME = exports.GET_USER_BY_EMAIL_QUERY = exports.GET_USERS_QUERY = void 0;
exports.GET_USERS_QUERY = "\n    query getUsers {\n        users {\n            nodes {\n                id\n                email\n            }\n        }\n    }\n    ";
exports.GET_USER_BY_EMAIL_QUERY = "\n    query GetUser($myUserFilter: UserFilter) {\n        users(filter: $myUserFilter) {\n            nodes {\n                id\n                email\n            }\n        }\n    }\n    ";
exports.GET_TEAMS_BY_NAME = "\n    query ($myTeamsFilter: TeamsFilter) {\n        teams(filter: $myTeamsFilter) {\n          nodes {\n            id\n            name\n          }\n        }\n      }\n      \n    ";
