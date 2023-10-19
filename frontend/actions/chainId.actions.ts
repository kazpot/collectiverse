const types = {
  CHAINID: 'CHAINID',
};

export default types;

export const chainIdChainged = (chainId: string) => {
  return { type: types.CHAINID, payload: chainId };
};
