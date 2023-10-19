import darkModeTypes from '../actions/dark.actions';

const reducer = (state = false, action: any) => {
  switch (action.type) {
    case darkModeTypes.DARK_MODE_ON:
      return true;
    case darkModeTypes.DARK_MODE_OFF:
      return false;
    default:
      return state;
  }
};

export default reducer;
