"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleRights = exports.roles = void 0;
const capa_role_1 = require("./modulesRole/capa.role");
const risk_role_1 = require("./modulesRole/risk.role");
const allRoles = {
    admin: ['getUsers', 'manageCapa', 'buySubscription', 'getSubscriptions', 'manageUsers', 'manageSites', 'manageProcesses', 'getWorkspaceById',
        ...capa_role_1.capaadminRoles,
        ...risk_role_1.RiskadminRoles
    ],
    // subAdmin: {
    //   subAdmin: [
    //     'getUsers',
    //     'manageCapa',
    //     'getSubscriptions',
    //     'manageUsers',
    //     'manageSites',
    //     'manageProcesses',
    //     ...capaSubadminRoles,
    //     ...RiskSubadminRoles
    //   ],
    //   standardUser: [
    //     'getSubscriptions',
    //     'manageCapa',
    //     'getWorkspaceUsers',
    //     ...capastandardUser,
    //     ...RiskstandardUser
    //   ],
    // },
    workspaceUser: {
        view: [
            'getWorkspaceById',
            ...capa_role_1.capaView,
            ...risk_role_1.RiskViewer
        ],
        edit: [
            'getWorkspaceById',
            ...capa_role_1.capaEdit,
            ...risk_role_1.RiskEditer
        ],
        admin: [
            'getWorkspaceById',
            ...capa_role_1.capaWAdmin,
            ...risk_role_1.RiskWAdmin
        ],
    },
};
exports.roles = Object.keys(allRoles);
// Normalize allRoles so that each role maps to a string[]
const normalizedRoleRights = [];
for (const [role, rights] of Object.entries(allRoles)) {
    if (Array.isArray(rights)) {
        normalizedRoleRights.push([role, rights]);
    }
    else if (typeof rights === 'object' && rights !== null) {
        for (const [subRole, subRights] of Object.entries(rights)) {
            normalizedRoleRights.push([subRole, subRights]);
        }
    }
}
exports.roleRights = new Map(normalizedRoleRights);
