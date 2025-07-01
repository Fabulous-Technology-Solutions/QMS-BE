const allRoles = {
  user: ["buySubscription"],
  admin: ['getUsers', 'manageUsers', "buySubscription"],
};

export const roles: string[] = Object.keys(allRoles);
export const roleRights: Map<string, string[]> = new Map(Object.entries(allRoles));
