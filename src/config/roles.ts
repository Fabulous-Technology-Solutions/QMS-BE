const allRoles = {
  user: ["getSubscriptions","manageCapa"],
  admin: ['getUsers', 'manageCapa', "buySubscription","getSubscriptions","manageUsers"],
  subAdmin: ["getSubscriptions"]
};

export const roles: string[] = Object.keys(allRoles);
export const roleRights: Map<string, string[]> = new Map(Object.entries(allRoles));
