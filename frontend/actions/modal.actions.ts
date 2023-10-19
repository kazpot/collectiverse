const types = {
  OPEN_MODAL: 'OPEN_MODAL',
  CLOSE_MODAL: 'CLOSE_MODAL',
};

export default types;

export const openModal = () => {
  return { type: types.OPEN_MODAL };
};

export const closeModal = () => {
  return { type: types.CLOSE_MODAL };
};
