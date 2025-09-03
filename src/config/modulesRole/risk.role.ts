const RiskadminRoles = [
  "manageRisk"
];

const RiskSubadminRoles = [
   "manageRisk"
];


const RiskWAdmin=[
    // permissions for workspace admin for role
      'updateRole',
      'getSingleRole',
      `createRole`,
      'deleteRole',
      'getWorkspaceRoleNames',

      // permissions for workspace admin for role
      'getWorkspaceUsers',
      'createWorkspaceUser',
      'updateWorkspaceUser',
      'deleteWorkspaceUser',
      'getSingleWorkspaceUser',

      // 'manageGroups',
      'createGroup',
      'getWorkspaceGroups',
      'getWorkspaceGroupNames',
      'getSingleGroup',
      'updateGroup',
      'deleteGroup',

      // 'manageLibrary',
      'deleteLibrary',
      'updateLibrary',
      'removeLibraryMember',
      'addLibraryMember',
      'getLibraryMembers',
      'getWorkspaceLibraryNames',
      'getWorkspaceLibraries',
      'createLibrary',
      'updateLibraryById',
      'getSingleLibrary',
      'update5W2H',
      'getUserLibraries',
      'restoreLibrary',
      'deletePermanentLibrary',
      'updateContainment',

      // Actions
      'deleteAction',
      'updateAction',
      'getSingleAction',
      'getActions',
      'createAction',
      'getTasks',

      // Attachments
      'deleteAttachment',
      'updateAttachment',
      'getAttachmentById',
      'getAttachmentsByWorkspace',
      'createAttachment',

      //Causes
      'createCauses',
      'getCauses',
      'deleteCause',
      'getCause',
      'updateCause',
      'getCausesNames',
      // Checklist
      'createChecklist',
      'getChecklists',
      'deleteChecklist',
      'getChecklist',
      'updateChecklist',
      'getChecklistNames',
      // Checklist Item
      'createChecklistItem',
      'getChecklistItems',
      'deleteChecklistItem',
      'getChecklistItem',
      'updateChecklistItem',
      'getChecklistItemNames',

      // Checklist History
      'createChecklistHistory',
      'getChecklistHistory',
      'updateChecklistHistory',
      'getChecklistHistories',
      'deleteChecklistHistory',
      'getChecklistHistoryNames',
      'getlogs',
      // Five Whys
      'getFiveWhysByLibrary',
      'deleteFiveWhys',
      'updateFiveWhys',
      'createFiveWhys',
      'getFiveWhys',
      //Ishikawa
      'getIshikawaByLibrary',
      'getIshikawa',
      'deleteIshikawa',
      'createIshikawa',
      //Other
      'needAttention',
      // Reports
      'createReport',
      'getReports',
      'getReport',
      'updateReport',
      'deleteReport',
      'getReport',
      // Report Preview
      'getReportPrevious',
      'getLibraryReports',
      'getReport',
      'updateReport'
]

const RiskstandardUser=[
  // permissions for standard user for role
   "manageRisk"
]
export { RiskWAdmin,RiskSubadminRoles,RiskadminRoles ,RiskstandardUser};