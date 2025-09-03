"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleRights = exports.roles = void 0;
const capa_role_1 = require("./modulesRole/capa.role");
const risk_role_1 = require("./modulesRole/risk.role");
const allRoles = {
    admin: ['getUsers', 'manageCapa', 'buySubscription', 'getSubscriptions', 'manageUsers', 'manageSites', 'manageProcesses',
        ...capa_role_1.capaadminRoles,
        ...risk_role_1.RiskadminRoles
    ],
    subAdmin: {
        subAdmin: [
            'getUsers',
            'manageCapa',
            'getSubscriptions',
            'manageUsers',
            'manageSites',
            'manageProcesses',
            ...capa_role_1.capaSubadminRoles,
            ...risk_role_1.RiskSubadminRoles
        ],
        standardUser: [
            'getSubscriptions',
            'manageCapa',
            'getWorkspaceUsers',
            ...capa_role_1.capastandardUser,
            ...risk_role_1.RiskstandardUser
        ],
    },
    workspaceUser: {
        view: [
            ...capa_role_1.capaView
        ],
        edit: [
            ...capa_role_1.capaEdit
        ],
        w_admin: [
            ...capa_role_1.capaWAdmin
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
