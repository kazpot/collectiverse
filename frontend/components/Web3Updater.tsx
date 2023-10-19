import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { currentUserChanged } from '../actions/currentUser.actions';
import { chainIdChainged } from '../actions/chainId.actions';
import { getCurrentNetwork, getCurrentUser } from '../common/util';
import { authUser, getUserProfile } from '../service/user';
import { useSnackbar } from 'notistack';

export default function Web3Updater() {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    async function init() {
      const user = await getCurrentUser();
      const userAddr = await user.getAddress();
      dispatch(currentUserChanged(userAddr));

      // user authentication
      const u = await getUserProfile(userAddr);
      if (!u) {
        const res = await authUser(userAddr);
        if (!res) {
          enqueueSnackbar('Failed to verify your signature!!', { variant: 'error' });
        }
      }

      const network = await getCurrentNetwork();
      dispatch(chainIdChainged(network.chainId.toString()));
    }
    init();

    if (window.ethereum) {
      window.ethereum.on('chainChanged', (chainId: any) => {
        dispatch(chainIdChainged(chainId));
        window.location.reload();
      });
      window.ethereum.on('accountsChanged', (account: any) => {
        if (account[0]) {
          dispatch(currentUserChanged(account[0]));
          window.location.reload();
        }
      });
    }
  }, [dispatch]);

  return <></>;
}
