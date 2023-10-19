const types = {
  CURRENT_USER: 'CURRENT_USER',
};

export default types;

export const currentUserChanged = (currentUser: string) => {
  return { type: types.CURRENT_USER, payload: currentUser };
};
