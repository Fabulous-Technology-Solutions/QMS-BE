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

const RiskstandardUser = [
  // permissions for standard user for role
  'manageRisk',
];
export { RiskWAdmin, RiskSubadminRoles, RiskadminRoles, RiskstandardUser,RiskViewer,RiskEditer };
