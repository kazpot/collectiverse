import loadingTypes from '../actions/loading.actions';

const reducer = (state = false, action: any) => {
  switch (action.type) {
    case loadingTypes.START_LOAD:
      return true;
    case loadingTypes.END_LOAD:
      return false;
    default:
      return state;
  }
};

export default reducer;
