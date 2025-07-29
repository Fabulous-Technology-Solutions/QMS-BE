const allRoles = {
  admin: [
    'getUsers',
    'manageCapa',
    'buySubscription',
    'getSubscriptions',
    'manageUsers',
    // 'ManageWorkspaceRolespermissions',
    'updateRole',
    'getSingleRole',
    'createRole',
    'deleteRole',
    'getWorkspaceRoleNames',
    // "manageWorkspaceUserPermissions"
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
    'removeGroupMember',
    'addGroupMember',
    'getGroupMembers',

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
    "update5W2H",

    // Actions
    'deleteAction',
    'updateAction',
    'getSingleAction',
    'getActions',
    'createAction',

    // Attachments
    'deleteAttachment',
    'updateAttachment',
    'getAttachmentById',
    'getAttachmentsByWorkspace',
    'createAttachment',

    //Causes
    "createCauses",
    "getCauses",
    "deleteCause",
    "getCause",
    "updateCause",
    "getCausesNames"



  ],
  subAdmin: {
    subAdmin: [
      /// Attachments
      'deleteAttachment',
      'updateAttachment',
      'getAttachmentById',
      'getAttachmentsByWorkspace',
      'createAttachment',

      'getSubscriptions',
      'manageCapa',
      // manageRoles
      'updateRole',
      'getSingleRole',
      `createRole`,
      'deleteRole',
      'getWorkspaceRoleNames',
      // 'manageWorkspaceUserPermissions'
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
      "update5W2H",


      // Actions
      'deleteAction',
      'updateAction',
      'getSingleAction',
      'getActions',
      'createAction',

      //Causes
      "createCauses",
      "getCauses",
      "deleteCause",
      "getCause",
      "updateCause",
      "getCausesNames"
    ],
    standardUser: [
      'getSubscriptions',
      'manageCapa',
      'getWorkspaceUsers',
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
      "update5W2H",

      // Actions
      'deleteAction',
      'updateAction',
      'getSingleAction',
      'getActions',
      'createAction',
      /// Attachments
      'deleteAttachment',
      'updateAttachment',
      'getAttachmentById',
      'getAttachmentsByWorkspace',
      'createAttachment',
      //Causes
      "createCauses",
      "getCauses",
      "deleteCause",
      "getCause",
      "updateCause",
      "getCausesNames"
    ],
  },

  workspaceUser: {
    view: [
      'getLibraryMembers',
      'getWorkspaceLibraryNames',
      'getWorkspaceLibraries',
      'getSingleLibrary',
      'getWorkspaceUsers',
      // Actions
      'getSingleAction',
      'getActions',
      //Causes
      "getCauses",
      "getCause",
      "getCausesNames"
    ],
    edit: [
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
      'getWorkspaceUsers',
      "update5W2H",

      // Actions
      'deleteAction',
      'updateAction',
      'getSingleAction',
      'getActions',
      // Attachments
      'deleteAttachment',
      'updateAttachment',
      'getAttachmentById',
      'getAttachmentsByWorkspace',
      
      //Causes
      "getCauses",
      "deleteCause",
      "getCause",
      "updateCause",
      "getCausesNames"
    ],
    w_admin: [
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
      "update5W2H",

      // Actions
      'deleteAction',
      'updateAction',
      'getSingleAction',
      'getActions',
      'createAction',

      // Attachments
      'deleteAttachment',
      'updateAttachment',
      'getAttachmentById',
      'getAttachmentsByWorkspace',
      'createAttachment',

      //Causes
      "createCauses",
      "getCauses",
      "deleteCause",
      "getCause",
      "updateCause",
      "getCausesNames"
    ],
  },
};

export const roles: string[] = Object.keys(allRoles);

// Normalize allRoles so that each role maps to a string[]
const normalizedRoleRights: [string, string[]][] = [];

for (const [role, rights] of Object.entries(allRoles)) {
  if (Array.isArray(rights)) {
    normalizedRoleRights.push([role, rights]);
  } else if (typeof rights === 'object' && rights !== null) {
    for (const [subRole, subRights] of Object.entries(rights)) {
      normalizedRoleRights.push([subRole, subRights]);
    }
  }
}

export const roleRights: Map<string, string[]> = new Map(normalizedRoleRights);
