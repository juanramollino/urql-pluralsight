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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addManagerToTeam = exports.addUserToTeam = exports.teamExists = exports.getUsers = exports.initClient = void 0;
var core_1 = require("@urql/core");
var teams_1 = require("./pluralsight/teams");
var users_1 = require("./pluralsight/users");
var queries = __importStar(require("./queries"));
var isomorphic_unfetch_1 = __importDefault(require("isomorphic-unfetch"));
// import * as mutations from "./mutations.js";
/**
 * Initializes the GraphQLClient
 * @returns {Client} a GraphQL client (@url/core)
 */
function initClient() {
    var endpoint = process.env.PLURALSIGHT_ENDPOINT;
    var APIKey = process.env.API_KEY;
    var client = (0, core_1.createClient)({
        url: "" + endpoint,
        fetch: isomorphic_unfetch_1.default,
        fetchOptions: function () {
            var token = APIKey;
            return {
                headers: { authorization: token ? "Bearer " + token : "" },
            };
        },
    });
    // console.log("Client initialized.");
    return client;
}
exports.initClient = initClient;
var getUsers = function () { return __awaiter(void 0, void 0, void 0, function () {
    var client, query;
    return __generator(this, function (_a) {
        client = initClient();
        query = queries.GET_USERS_QUERY;
        client
            .query(query)
            .toPromise()
            .then(function (result) {
            console.log(JSON.stringify(result.data));
        });
        return [2 /*return*/];
    });
}); };
exports.getUsers = getUsers;
// Returns a bool indicating if a Team with the name passed as parameter exists
var teamExists = function (teamName) { return __awaiter(void 0, void 0, void 0, function () {
    var client, query, variables, teamExists;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                client = initClient();
                query = queries.GET_TEAMS_BY_NAME;
                variables = { myTeamsFilter: { name: teamName } };
                teamExists = false;
                // Execute GraphQL query and analyze results.
                return [4 /*yield*/, client
                        .query(query, variables)
                        .toPromise()
                        .then(function (result) {
                        var nodes = result.data.teams.nodes;
                        teamExists = nodes.length == 1;
                        console.log("[TeamExists] " + teamName + " -> " + teamExists + " ]");
                        console.log(nodes);
                    })];
            case 1:
                // Execute GraphQL query and analyze results.
                _a.sent();
                // Return
                return [2 /*return*/, teamExists];
        }
    });
}); };
exports.teamExists = teamExists;
var log = function (message) {
    return function (arg) {
        console.log(message);
        return arg;
    };
};
/**
 * Adds a User to a Team using e-mail and team name as parameters.
 * @param {string} email e-mail address of the user
 * @param {string} teamName team name to be added
 */
var addUserToTeam = function (email, teamName) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, Promise.all([(0, users_1.getUserByEmail)(email), (0, teams_1.getTeamInfo)(teamName)]).then(function (_a) {
                var pluralsightUser = _a[0], pluralsightTeam = _a[1];
                // DEBUG
                console.log("[Add user to team] Adding user " + email + " to team \"" + teamName + "\"");
                console.log("[Add user to Team] Team name : " + (pluralsightTeam === null || pluralsightTeam === void 0 ? void 0 : pluralsightTeam.name));
                return (!pluralsightTeam
                    ? (0, teams_1.createTeam)(teamName)
                    : Promise.resolve(pluralsightTeam))
                    .then(log("lorem"))
                    .then(function (pluralsightTeam) {
                    log("[Add user to team] User ID from PS: " + pluralsightUser.id);
                    log("[Add user to team] Team ID from PS: " + pluralsightTeam.id);
                    return (0, teams_1.addTeamMember)(pluralsightUser.id, pluralsightTeam.id);
                });
            })];
    });
}); };
exports.addUserToTeam = addUserToTeam;
/**
 * Adds a Team Manager to the Team using the supplied manager's e-mail address and team name.
 * If the Team Manager does not exist
 * @param {string} managerEmail Manager e-mail address
 * @param {string} teamName Team name
 * @param {boolean} [inviteIfNotExists=false] Send an invitation if the manager does not exists
 */
function addManagerToTeam(managerEmail, teamName, inviteIfNotExists) {
    if (inviteIfNotExists === void 0) { inviteIfNotExists = false; }
    return __awaiter(this, void 0, void 0, function () {
        var managerInfo, teamInfo;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, users_1.getUserByEmail)(managerEmail)];
                case 1:
                    managerInfo = _a.sent();
                    return [4 /*yield*/, (0, teams_1.getTeamInfo)(teamName)];
                case 2:
                    teamInfo = _a.sent();
                    // DEBUG
                    console.log("[AddManagerToTeam] Adding " + managerEmail + " as manager of team \"" + teamName + "\"");
                    // If the team exists
                    if (teamInfo) {
                        // If the manager exists
                        if (managerInfo) {
                            console.log(managerInfo);
                            console.log(teamInfo);
                            (0, teams_1.AddTeamManager)(managerInfo.id, teamInfo.id);
                        }
                        else {
                            if (inviteIfNotExists) {
                                // If the manager is new, invite them.
                                // InviteTeamManager()
                                console.log("Manager Info not found. New Manager :", managerEmail);
                                (0, teams_1.InviteManager)(managerEmail, teamInfo.id);
                            }
                        }
                    }
                    return [2 /*return*/];
            }
        });
    });
}
exports.addManagerToTeam = addManagerToTeam;
