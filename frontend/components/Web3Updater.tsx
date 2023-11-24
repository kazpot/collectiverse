import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { currentUserChanged } from '../actions/currentUser.actions';
import { chainIdChainged } from '../actions/chainId.actions';
import { useRouter } from 'next/router';
import { isUser } from '../service/user';

export default function Web3Updater() {
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('chainChanged', (chainId: any) => {
        dispatch(chainIdChainged(chainId));
        window.location.reload();
      });
      window.ethereum.on('accountsChanged', async (account: any) => {
        const address = account[0];
        if (!address) {
          dispatch(currentUserChanged(''));
        } else {
          const result = await isUser(address);
          if (result) {
            dispatch(currentUserChanged(address));
          } else {
            dispatch(currentUserChanged(''));
          }
        }
      });
    }
  }, [dispatch, router]);

  return <></>;
}
