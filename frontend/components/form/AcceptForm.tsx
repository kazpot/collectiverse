import { Button, Grid, List, ListItem, Typography, Card } from '@mui/material';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useDispatch, useSelector } from 'react-redux';
import { closeModal } from '../../actions/modal.actions';
import { BidOrder, NFTCollection } from '../../common/types';
import { renderUnixTime, shortAddressOnly } from '../../common/util';
import { acceptBidOrder } from '../../service/order';
import { RootState } from '../../store/configureStore';
import { useState } from 'react';
import { chains } from '../../common/const';

type AcceptFormProps = {
  item: NFTCollection;
  bestBidOrder: BidOrder;
};

export default function AcceptForm({ item, bestBidOrder }: AcceptFormProps) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const currentUserAddress = useSelector((state: RootState) => state.currentUser);
  const chainId: number = parseInt(useSelector((state: RootState) => state.chainId));

  const [disableButton, setDisableButton] = useState(false);

  const handleSubmit = async (item: NFTCollection, bestBid: BidOrder) => {
    setDisableButton(true);
    const res = await acceptBidOrder(item, bestBid);
    if (res) {
      enqueueSnackbar('Successfully accepted!', { variant: 'success' });
      dispatch(closeModal());
      router.push(`/about/${currentUserAddress}`);
    } else {
      enqueueSnackbar('Failed to accept!', { variant: 'error' });
      dispatch(closeModal());
    }
  };

  return (
    <Grid container spacing={3} direction='column' alignItems='center' justifyContent='center'>
      <Grid item xs={12}>
        <Card key={bestBidOrder.createTime} style={{ marginTop: '10px' }}>
          <List>
            <ListItem>
              <Grid container>
                <Grid item xs={4}>
                  <Typography>Price</Typography>
                </Grid>
                <Grid item xs={8}>
                  <Typography>
                    {bestBidOrder.price} {chains[chainId] && chains[chainId].auctionSymbol}
                  </Typography>
                </Grid>
              </Grid>
            </ListItem>
            <ListItem>
              <Grid container>
                <Grid item xs={4}>
                  <Typography>Bid placed by</Typography>
                </Grid>
                <Grid item xs={8}>
                  <Typography>{shortAddressOnly(bestBidOrder.taker)}</Typography>
                </Grid>
              </Grid>
            </ListItem>
            <ListItem>
              <Grid container>
                <Grid item xs={4}>
                  <Typography>Created time</Typography>
                </Grid>
                <Grid item xs={8}>
                  <Typography>{renderUnixTime(bestBidOrder.createTime)}</Typography>
                </Grid>
              </Grid>
            </ListItem>
          </List>
        </Card>
      </Grid>

      <Grid item xs={12}>
        <Button
          style={{ margin: '10px' }}
          variant='contained'
          onClick={() => handleSubmit(item, bestBidOrder)}
          disabled={disableButton}
        >
          Apply
        </Button>
        <Button
          style={{ margin: '10px' }}
          variant='contained'
          onClick={() => dispatch(closeModal())}
          disabled={disableButton}
        >
          Cancel
        </Button>
      </Grid>
    </Grid>
  );
}
