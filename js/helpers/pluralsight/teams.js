"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InviteManager = exports.getTeamInfo = exports.addTeamMember = exports.AddTeamManager = exports.createTeam = void 0;
var graphql_1 = require("../graphql");
var queries = __importStar(require("../queries"));
var mutations = __importStar(require("../mutations"));
/**
 * Adds a new Team to Pluralsight by name
 * @param {string} name Name of the new Team
 * @param {string} [desciption=""] Desciption of the new Team (unused)
 * @returns a JSON element with the team information
 */
function createTeam(name, desciption) {
    if (desciption === void 0) { desciption = ""; }
    return __awaiter(this, void 0, void 0, function () {
        var client, mutation, variables, teamInfo;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    client = (0, graphql_1.initClient)();
                    mutation = mutations.ADD_TEAM;
                    variables = { "myTeamInput": { "name": name } };
                    teamInfo = { id: "", name: "" };
                    // DEBUG
                    console.log("[Create Team] Adding team " + name);
                    // console.log(variables);
                    // Execute GraphQL mutation to add the team
                    // Should check for existence? Maybe
                    return [4 /*yield*/, client
                            .mutation(mutation, variables)
                            .toPromise()
                            .then(function (result) {
                            // DEBUG
                            // console.log("Query executed!");
                            // console.log(result);
                            if (result.error) {
                                // Most likely, the team already exists.
                                // TODO: Improve all of this logic.
                                console.error(result.error);
                            }
                            else {
                                console.log(result.data.addTeam);
                                teamInfo = {
                                    "id": result.data.addTeam.id,
                                    "name": result.data.addTeam.name
                                };
                                // DEBUG
                                // console.log(teamInfo);
                            }
                        })
                            .catch(function (error) {
                            // I don't think this works.
                            console.log("Error occured when trying to add a team");
                            console.log(error);
                        })];
                case 1:
                    // console.log(variables);
                    // Execute GraphQL mutation to add the team
                    // Should check for existence? Maybe
                    _a.sent();
                    return [2 /*return*/, (teamInfo)];
            }
        });
    });
}
exports.createTeam = createTeam;
/**
 * Adds a Team Manager to the Team using the provided ID's.
 * @param {string} userId String representing the User Id of the Manager (should exist)
 * @param {string} teamId String representing the Team Id
 */
function AddTeamManager(userId, teamId) {
    return __awaiter(this, void 0, void 0, function () {
        var client, mutation, variables;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    client = (0, graphql_1.initClient)();
                    mutation = mutations.ADD_TEAM_MANAGER;
                    variables = { "myTeamManagerInput": { "teamId": teamId, "userId": userId, "permissionLevel": "LIMITED" } };
                    // Execute GraphQL mutation to add the team
                    // Should check for existence? Maybe
                    return [4 /*yield*/, client
                            .mutation(mutation, variables)
                            .toPromise()
                            .then(function (result) {
                            // DEBUG
                            console.log("Add Team Manager query executed!");
                            console.log(result);
                            if (result.error) {
                                // Most likely, the team already exists.
                                // TODO: Improve all of this logic.
                                console.log(result.error);
                                //teamInfo = null;
                            }
                            else {
                                /*teamInfo = {
                                    "id" : result.data.addTeam.id ,
                                    "name" : result.data.addTeam.name
                                };*/
                                console.log(result.data);
                                // DEBUG
                                // console.log(teamInfo);
                            }
                        })
                            .catch(function (error) {
                            // I don't think this works.
                            console.log("Error occured when trying to add a member to a team");
                            console.log(error);
                        })];
                case 1:
                    // Execute GraphQL mutation to add the team
                    // Should check for existence? Maybe
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.AddTeamManager = AddTeamManager;
/**
 * Adds a Member to a Team based on their Ids
 * @param {string} userId String representing the Pluralsight User Id
 * @param {string} teamId String representing the Pluralsight Team Id
 */
function addTeamMember(userId, teamId) {
    return __awaiter(this, void 0, void 0, function () {
        var client, mutation, variables;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    client = (0, graphql_1.initClient)();
                    mutation = mutations.ADD_TEAM_MEMBER;
                    variables = { "myTeamMemberInput": { "teamId": teamId, "userId": userId } };
                    // Execute GraphQL mutation to add the team
                    // Should check for existence? Maybe
                    return [4 /*yield*/, client
                            .mutation(mutation, variables)
                            .toPromise()
                            .then(function (result) {
                            // DEBUG
                            // console.log("Add Team Member query executed!");
                            // console.log(result);
                            if (result.error) {
                                // Most likely, the team already exists.
                                // TODO: Improve all of this logic.
                                console.log(result.error);
                                //teamInfo = null;
                            }
                            else {
                                /*teamInfo = {
                                    "id" : result.data.addTeam.id ,
                                    "name" : result.data.addTeam.name
                                };*/
                                // DEBUG
                                // console.log(teamInfo);
                            }
                        })
                            .catch(function (error) {
                            // I don't think this works.
                            console.log("Error occured when trying to add a member to a team");
                            console.log(error);
                        })];
                case 1:
                    // Execute GraphQL mutation to add the team
                    // Should check for existence? Maybe
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.addTeamMember = addTeamMember;
/**
 * Obtains Team informataion based on the team name supplied as parameter.
 * @param {string} teamName Team Name
 * @returns a JSON object with the Team information
 */
function getTeamInfo(teamName) {
    return __awaiter(this, void 0, void 0, function () {
        var client, query, variables, teamInfo;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    client = (0, graphql_1.initClient)();
                    query = queries.GET_TEAMS_BY_NAME;
                    variables = { "myTeamsFilter": { "name": teamName } };
                    teamInfo = { id: "", name: "" };
                    console.log("[GetTeamInfo] Searching for team " + teamName);
                    // Execute GraphQL query and analyze results.
                    return [4 /*yield*/, client
                            .query(query, variables)
                            .toPromise()
                            .then(function (result) {
                            var nodes = result.data.teams.nodes;
                            // DEBUG to check result count.
                            console.log("[Get team info] Obtained " + nodes.length + " Teams");
                            // Need to further filter by Team Name because the API uses patterns to filter by name.
                            var finalists = nodes.filter(function (team) { return team.name == teamName; });
                            switch (true) {
                                case finalists.length > 1:
                                    // This should never happen.
                                    throw "[Get team info] Got two or more teams and couldn't parse them.";
                                    break;
                                case finalists.length == 1:
                                    // If an exact match is found, return that team info. 
                                    console.log('[Get team info] Team found');
                                    teamInfo = finalists[0];
                                    console.log(teamInfo);
                                    return (teamInfo);
                                    break;
                                default:
                                    return undefined;
                                    break;
                            }
                        })
                            .catch(function (error) {
                            console.log(error);
                            return (undefined);
                        })];
                case 1:
                    // Execute GraphQL query and analyze results.
                    _a.sent();
                    // Return undefined if no team is found
                    console.log("IMOUTAHERE");
                    return [2 /*return*/, undefined];
            }
        });
    });
}
exports.getTeamInfo = getTeamInfo;
/**
 *
 * @param managerEmail
 * @param teamId
 */
function InviteManager(managerEmail, teamId) {
    return __awaiter(this, void 0, void 0, function () {
        var client, mutation, variables;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    client = (0, graphql_1.initClient)();
                    mutation = mutations.INVITE_MANAGER;
                    variables = {
                        "myManagerInput": {
                            "email": managerEmail,
                            "teamId": teamId,
                            "shouldConsumeLicense": false,
                            "permissionSetId": process.env.MANAGER_PERMISSION_SET_ID
                        }
                    };
                    // Execute GraphQL mutation to add the team
                    // Should check for existence? Maybe
                    return [4 /*yield*/, client
                            .mutation(mutation, variables)
                            .toPromise()
                            .then(function (result) {
                            // DEBUG
                            console.log("Invite Team Manager query executed!");
                            console.log(result);
                            if (result.error) {
                                // Most likely, the team already exists.
                                // TODO: Improve all of this logic.
                                console.log(result.error);
                                //teamInfo = null;
                            }
                            else {
                                /*teamInfo = {
                                    "id" : result.data.addTeam.id ,
                                    "name" : result.data.addTeam.name
                                };*/
                                console.log(result.data);
                                // DEBUG
                                // console.log(teamInfo);
                            }
                        })
                            .catch(function (error) {
                            // I don't think this works.
                            console.log("Error occured when trying to add a member to a team");
                            console.log(error);
                        })];
                case 1:
                    // Execute GraphQL mutation to add the team
                    // Should check for existence? Maybe
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.InviteManager = InviteManager;
