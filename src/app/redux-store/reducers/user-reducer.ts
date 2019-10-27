import { ADD_USERS, REMOVE_USERS } from '../actions/actions';

function userReducer(users = [], action: any) {
  switch (action.type) {
    case ADD_USERS:
      const toAddUsers = action.toAdd.filter(user => !users.map(x => x.login).includes(user.login));
      return [...users, ...toAddUsers];

    case REMOVE_USERS:
      return users.filter(user => !action.toRemove.map(x => x.login).includes(user.login));

    default:
      return users;
  }
}

export default userReducer;
