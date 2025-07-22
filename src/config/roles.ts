const allRoles = {
  admin: ['getUsers', 'manageCapa', "buySubscription","getSubscriptions","manageUsers","manageRole","manageWorkspaceUsers"],
  subAdmin: ["getSubscriptions","manageCapa","manageRole","manageWorkspaceUsers"]
};

export const roles: string[] = Object.keys(allRoles);
export const roleRights: Map<string, string[]> = new Map(Object.entries(allRoles));
