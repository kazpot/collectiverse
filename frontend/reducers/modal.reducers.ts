import modalTypes from '../actions/modal.actions';

const reducer = (state = { isOpen: false }, action: any) => {
  switch (action.type) {
    case modalTypes.OPEN_MODAL:
      return { ...state, isOpen: true };
    case modalTypes.CLOSE_MODAL:
      return { ...state, isOpen: false };
    default:
      return state;
  }
};

export default reducer;
