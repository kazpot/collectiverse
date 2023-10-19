const types = {
  START_LOAD: 'START_LOAD',
  END_LOAD: 'END_LOAD',
};

export default types;

export const startLoad = () => {
  return { type: types.START_LOAD };
};

export const endLoad = () => {
  return { type: types.END_LOAD };
};
