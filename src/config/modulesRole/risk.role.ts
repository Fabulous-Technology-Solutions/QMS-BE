const RiskadminRoles = [
  'manageRisk',
  'setRiskAppetite',
  'setRiskassessmentApproval',
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
  'Risk_deleteAttachment',
 // assessment permissions
  'risk_createAssessment',
  'risk_getAssessmentById',
  'risk_getAssessmentsByLibrary',
  'risk_updateAssessment',
  'risk_deleteAssessment',
  // report permissions
  'risk-createReport',
  'risk-getReports',
  'risk-getReport',
  'risk-updateReport',
  'risk-deleteReport'
];

const RiskSubadminRoles = [
  'manageRisk',
  'setRiskAppetite',
    'setRiskassessmentApproval',
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
    // assessment permissions
  'risk_createAssessment',
  'risk_getAssessmentById',
  'risk_getAssessmentsByLibrary',
  'risk_updateAssessment',
  'risk_deleteAssessment',
    // report permissions
  'risk-createReport',
  'risk-getReports',
  'risk-getReport',
  'risk-updateReport',
  'risk-deleteReport'
];

const RiskWAdmin = [
  'setRiskAppetite',
    'setRiskassessmentApproval',
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
    // assessment permissions
  'risk_createAssessment',
  'risk_getAssessmentById',
    'risk_getAssessmentsByLibrary',
  'risk_updateAssessment',
  'risk_deleteAssessment',
    // report permissions
  'risk-createReport',
  'risk-getReports',
  'risk-getReport',
  'risk-updateReport',
  'risk-deleteReport'
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
  'Risk_getIshikawaByLibrary',
    // assessment permissions
  'risk_getAssessmentById',
  'risk_getAssessmentsByLibrary',
    // report permissions
  'risk-getReports',
  'risk-getReport'
];

const RiskEditer = [
  'setRiskAppetite',
    'setRiskassessmentApproval',
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
  'Risk_deleteIshikawa',
    // assessment permissions
  'risk_getAssessmentById',
  'risk_getAssessmentsByWorkspace',
  'risk_updateAssessment',
  'risk_deleteAssessment',
    // report permissions
  'risk-getReports',
  'risk-getReport',
  'risk-updateReport',
  'risk-deleteReport'
];

const RiskstandardUser = [
  // permissions for standard user for role
  'manageRisk',
  'setRiskAppetite',
    'setRiskassessmentApproval',
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
    // assessment permissions
  'risk_createAssessment',
  'risk_getAssessmentById',
  'risk_getAssessmentsByLibrary',
  'risk_updateAssessment',
  'risk_deleteAssessment',
    // report permissions
  'risk-createReport',
  'risk-getReports',
  'risk-getReport',
  'risk-updateReport',
  'risk-deleteReport'
];
export { RiskWAdmin, RiskSubadminRoles, RiskadminRoles, RiskstandardUser, RiskViewer, RiskEditer };
