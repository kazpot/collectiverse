const types = {
  DARK_MODE_ON: 'DARK_MODE_ON',
  DARK_MODE_OFF: 'DARK_MODE_OFF',
};

export default types;

export const darkModeOn = () => {
  return { type: types.DARK_MODE_ON };
};

export const darkModeOff = () => {
  return { type: types.DARK_MODE_OFF };
};
