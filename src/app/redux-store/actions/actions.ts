export const ADD_USERS = 'ADD_USERS';

export function addUsers(toAdd: Array<any>) {
  if (Array.isArray(toAdd)) {
    return { type: ADD_USERS, toAdd };
  }
  return { type: ADD_USERS, toAdd: [toAdd]};
}

export const REMOVE_USERS = 'REMOVE_USERS';

export function removeUsers(toRemove: Array<any>) {
  return { type: REMOVE_USERS, toRemove };
}