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
  ],
  subAdmin: {
    subAdmin: [
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
    ],
    standardUser: ['getSubscriptions', 'manageCapa'],
  },

  workspaceUser: {
    view: [],
    edit: [],
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
