import { capaEdit, capaView, capaadminRoles } from './modulesRole/capa.role';
import { RiskadminRoles, RiskEditer, RiskViewer } from './modulesRole/risk.role';

const allRoles = {
  admin: [
    'getUsers',
    'manageCapa',
    'buySubscription',
    'getSubscriptions',
    'manageUsers',
    'manageSites',
    'manageProcesses',
    'getWorkspaceById',
    ...capaadminRoles,
    ...RiskadminRoles,
    'updateNotificationSetting',
    'getNotificationSetting',
  ],
  workspaceUser: {
    view: ['getWorkspaceById', ...capaView, ...RiskViewer, 'updateNotificationSetting', 'getNotificationSetting'],
    edit: ['getWorkspaceById', ...capaEdit, ...RiskEditer, 'updateNotificationSetting', 'getNotificationSetting'],
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
