import chainId from '../actions/chainId.actions';

const reducer = (state = '', action: any) => {
  switch (action.type) {
    case chainId.CHAINID:
      return action.payload;
    default:
      return state;
  }
};

export default reducer;
