import currentUser from '../actions/currentUser.actions';

const reducer = (state = '', action: any) => {
  switch (action.type) {
    case currentUser.CURRENT_USER:
      return action.payload;
    default:
      return state;
  }
};

export default reducer;
