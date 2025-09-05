"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RiskEditer = exports.RiskViewer = exports.RiskstandardUser = exports.RiskadminRoles = exports.RiskSubadminRoles = exports.RiskWAdmin = void 0;
const RiskadminRoles = [
    'manageRisk',
    // permissions for admin role
    'updateControl',
    'deleteControl',
    'createControl',
    'getControl',
    'getControls',
    // consequence permissions
    'createConsequence',
    'getConsequence',
    'getConsequences',
    'updateConsequence',
    'deleteConsequence',
];
exports.RiskadminRoles = RiskadminRoles;
const RiskSubadminRoles = [
    'manageRisk',
    // permissions for admin role
    'updateControl',
    'deleteControl',
    'createControl',
    'getControl',
    'getControls',
    // consequence permissions
    'createConsequence',
    'getConsequence',
    'getConsequences',
    'updateConsequence',
    'deleteConsequence',
];
exports.RiskSubadminRoles = RiskSubadminRoles;
const RiskWAdmin = [
    // permissions for admin role
    'updateControl',
    'deleteControl',
    'createControl',
    'getControl',
    'getControls',
    // consequence permissions
    'createConsequence',
    'getConsequence',
    'getConsequences',
    'updateConsequence',
    'deleteConsequence',
];
exports.RiskWAdmin = RiskWAdmin;
const RiskViewer = [
    // permissions for viewer role
    'manageRisk',
    // permissions for admin role
    'updateControl',
    'deleteControl',
    'createControl',
    'getControl',
    'getControls',
    // consequence permissions
    'createConsequence',
    'getConsequence',
    'getConsequences',
    'updateConsequence',
    'deleteConsequence'
];
exports.RiskViewer = RiskViewer;
const RiskEditer = [
    // permissions for editor role'
    'updateControl',
    'deleteControl',
    'getControl',
    'getControls',
    // consequence permissions
    'getConsequence',
    'getConsequences',
    'updateConsequence',
    'deleteConsequence'
];
exports.RiskEditer = RiskEditer;
const RiskstandardUser = [
    // permissions for standard user for role
    'manageRisk',
];
exports.RiskstandardUser = RiskstandardUser;
