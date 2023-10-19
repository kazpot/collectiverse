import { Grid } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { ModalType, NFTCollection, BidOrder } from '../common/types';
import { useState } from 'react';
import { RootState } from '../store/configureStore';
import ModalDialog from './ModalDaialog';
import { cancelOrder } from '../service/order';
import router from 'next/router';
import { openModal } from '../actions/modal.actions';
import { getBidOrders } from '../service/item';
import { useSnackbar } from 'notistack';
import NFTCreatedCard from './card/NFTCreatedCard';

type Props = {
  items?: NFTCollection[];
};

export default function UserDashboard({ items }: Props) {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const currentUserAddress = useSelector((state: RootState) => state.currentUser);
  const { isOpen } = useSelector((state: RootState) => state.modal);

  const [item, setItem] = useState<NFTCollection>();
  const [bestBid, setBestBid] = useState<BidOrder>();

  const cancel = async (item: NFTCollection) => {
    const res = await cancelOrder(item);
    if (res) {
      enqueueSnackbar('Successfully canceled!', { variant: 'success' });
      router.push(`/about/${currentUserAddress}`);
    } else {
      enqueueSnackbar('Failed to cancel!', { variant: 'error' });
    }
  };

  const accept = async (item: NFTCollection) => {
    setItem(item);
    const bidOrders = await getBidOrders(item);
    if (bidOrders.length > 0) {
      const bestBid = bidOrders.reduce((prev: BidOrder, curr: BidOrder) => {
        return prev.price > curr.price ? prev : curr;
      });
      setBestBid(bestBid);
    } else {
      enqueueSnackbar('No one bids this item', { variant: 'error' });
      return;
    }
    dispatch(openModal());
  };

  return (
    <div>
      <Grid container spacing={3}>
        {items &&
          items.length > 0 &&
          items.map((item) => (
            <Grid item md={4} key={item.listingTime}>
              <NFTCreatedCard
                item={item}
                accept={accept}
                cancel={cancel}
                loading={false}
                currentUserAddress={currentUserAddress}
              />
            </Grid>
          ))}
      </Grid>
      {item && bestBid && (
        <ModalDialog isOpen={isOpen} item={item} bestBidOrder={bestBid} type={ModalType.Accept} />
      )}
    </div>
  );
}
