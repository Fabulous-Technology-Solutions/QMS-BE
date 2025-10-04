import {capaEdit,  capaView,capaadminRoles} from './modulesRole/capa.role';
import { RiskadminRoles ,RiskEditer,RiskViewer} from './modulesRole/risk.role';

const allRoles = {
  admin: ['getUsers', 'manageCapa', 'buySubscription', 'getSubscriptions', 'manageUsers', 'manageSites', 'manageProcesses','getWorkspaceById',
    ...capaadminRoles,
    ...RiskadminRoles
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
      ...capaView,
      ...RiskViewer
    ],
    edit: [
      'getWorkspaceById',
      ...capaEdit,
      ...RiskEditer
    ]
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
