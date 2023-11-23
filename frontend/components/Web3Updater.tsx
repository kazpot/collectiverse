import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { currentUserChanged } from '../actions/currentUser.actions';
import { chainIdChainged } from '../actions/chainId.actions';
import { useRouter } from 'next/router';

export default function Web3Updater() {
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('chainChanged', (chainId: any) => {
        dispatch(chainIdChainged(chainId));
        window.location.reload();
      });
      window.ethereum.on('accountsChanged', (account: any) => {
        if (account[0]) {
          dispatch(currentUserChanged(account[0]));
          window.location.reload();
        } else {
          router.push('/');
        }
      });
    }
  }, [dispatch, router]);

  return <></>;
}
