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
    // risk actions
    'risk_createAction',
    'risk_getActions',
    'risk_getSingleAction',
    'risk_updateAction',
    'risk_deleteAction',
    'risk_getTasks',
    // risk five whys
    'Risk_createFiveWhys',
    'Risk_getFiveWhys',
    'Risk_getFiveWhysByLibrary',
    'Risk_updateFiveWhys',
    'Risk_deleteFiveWhys',
    // Ishikawa permissions
    'Risk_createIshikawa',
    'Risk_getIshikawa',
    'Risk_getIshikawaByLibrary',
    'Risk_deleteIshikawa',
    // Attachment permissions
    'Risk_createAttachment',
    'Risk_getAttachmentById',
    'Risk_getAttachmentsByWorkspace',
    'Risk_updateAttachment',
    'Risk_deleteAttachment'
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
    // risk actions
    'risk_createAction',
    'risk_getActions',
    'risk_getSingleAction',
    'risk_updateAction',
    'risk_deleteAction',
    'risk_getTasks',
    // risk five whys
    'Risk_createFiveWhys',
    'Risk_getFiveWhys',
    'Risk_getFiveWhysByLibrary',
    'Risk_updateFiveWhys',
    'Risk_deleteFiveWhys',
    // Ishikawa permissions
    'Risk_createIshikawa',
    'Risk_getIshikawa',
    'Risk_getIshikawaByLibrary',
    'Risk_deleteIshikawa'
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
    // risk actions
    'risk_createAction',
    'risk_getActions',
    'risk_getSingleAction',
    'risk_updateAction',
    'risk_deleteAction',
    'risk_getTasks',
    // risk five whys
    'Risk_createFiveWhys',
    'Risk_getFiveWhys',
    'Risk_getFiveWhysByLibrary',
    'Risk_updateFiveWhys',
    'Risk_deleteFiveWhys',
    // Ishikawa permissions
    'Risk_createIshikawa',
    'Risk_getIshikawa',
    'Risk_getIshikawaByLibrary',
    'Risk_deleteIshikawa'
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
    'deleteConsequence',
    // risk actions
    'risk_getActions',
    'risk_getSingleAction',
    'risk_getTasks',
    // risk five whys
    'Risk_getFiveWhys',
    'Risk_getFiveWhysByLibrary',
    // Ishikawa permissions
    'Risk_getIshikawa',
    'Risk_getIshikawaByLibrary'
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
    'deleteConsequence',
    // risk actions
    'risk_getActions',
    'risk_getSingleAction',
    'risk_updateAction',
    'risk_deleteAction',
    'risk_getTasks',
    // risk five whys
    'Risk_getFiveWhys',
    'Risk_getFiveWhysByLibrary',
    'Risk_updateFiveWhys',
    'Risk_deleteFiveWhys',
    // Ishikawa permissions
    'Risk_getIshikawa',
    'Risk_getIshikawaByLibrary',
    'Risk_deleteIshikawa'
];
exports.RiskEditer = RiskEditer;
const RiskstandardUser = [
    // permissions for standard user for role
    'manageRisk',
    // risk actions
    'risk_createAction',
    'risk_getActions',
    'risk_getSingleAction',
    'risk_updateAction',
    'risk_deleteAction',
    'risk_getTasks',
    // risk five whys
    'Risk_createFiveWhys',
    'Risk_getFiveWhys',
    'Risk_getFiveWhysByLibrary',
    'Risk_updateFiveWhys',
    'Risk_deleteFiveWhys',
    // Ishikawa permissions
    'Risk_createIshikawa',
    'Risk_getIshikawa',
    'Risk_getIshikawaByLibrary',
    'Risk_deleteIshikawa'
];
exports.RiskstandardUser = RiskstandardUser;
