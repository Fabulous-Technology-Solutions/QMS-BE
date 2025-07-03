const allRoles = {
  user: ["getSubscriptions"],
  admin: ['getUsers', 'manageUsers', "buySubscription","getSubscriptions"],
  subAdmin: []
};

export const roles: string[] = Object.keys(allRoles);
export const roleRights: Map<string, string[]> = new Map(Object.entries(allRoles));
