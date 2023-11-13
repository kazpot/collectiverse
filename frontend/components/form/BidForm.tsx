import { Button, Grid, TextField } from '@mui/material';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { closeModal } from '../../actions/modal.actions';
import { NFTCollection } from '../../common/types';
import { createBidOrder, createFirstBidOrder } from '../../service/order';

type Props = {
  item: NFTCollection;
  bestBid: string;
};

export default function BidForm({ item, bestBid }: Props) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const step = 0.01;
  const decimalPoint = 2;

  const currentBid: string = bestBid;
  const minPrice = parseFloat(currentBid).toFixed(decimalPoint).toString();
  const maxPrice = '3000';
  const [newPrice, setNewPrice] = useState<string>(
    (parseFloat(currentBid) + step).toFixed(decimalPoint).toString(),
  );
  const [errorMessage, setErrorMessage] = useState('');
  const [disableButton, setDisableButton] = useState(false);

  useEffect(() => {
    if (
      parseFloat(newPrice) <= parseFloat(minPrice) ||
      parseFloat(newPrice) > parseFloat(maxPrice)
    ) {
      setErrorMessage(`MIN: ${minPrice}, MAX: ${maxPrice}`);
    } else {
      setErrorMessage('');
    }
  }, [newPrice, errorMessage, item.price, minPrice, bestBid]);

  const handleSubmit = async (event: any) => {
    setDisableButton(true);
    event.preventDefault();
    if (!newPrice || newPrice == '0') {
      alert('Price must not be empty');
      return;
    }
    let res;
    if (bestBid === '0') {
      res = await createFirstBidOrder(item, newPrice.toString());
    } else {
      res = await createBidOrder(item, newPrice.toString(), bestBid);
    }

    if (res) {
      enqueueSnackbar('Successfull bid!', { variant: 'success' });
      router.push(`/products/${item.nftAddress}:${item.tokenId}`);
      dispatch(closeModal());
    } else {
      enqueueSnackbar('Failed to bid!', { variant: 'error' });
    }
  };

  const handleOnChange = (e: any) => {
    setNewPrice(e.target.value);
  };

  return (
    <Grid container spacing={3} direction='column' alignItems='center' justifyContent='center'>
      <Grid item xs={12}>
        <TextField
          error={
            parseFloat(newPrice) <= parseFloat(minPrice) ||
            parseFloat(newPrice) > parseFloat(maxPrice)
          }
          type='number'
          label='Bid price'
          required
          variant='filled'
          inputProps={{
            min: 0,
            step,
            style: {
              textAlign: 'center',
              fontSize: 40,
            },
          }}
          helperText={errorMessage}
          onChange={handleOnChange}
          defaultValue={(parseFloat(minPrice) + step).toFixed(decimalPoint)}
        />
      </Grid>

      <Grid item xs={12}>
        <Button
          style={{ margin: '10px' }}
          variant='contained'
          disabled={
            parseFloat(newPrice) <= parseFloat(minPrice) ||
            parseFloat(newPrice) > parseFloat(maxPrice) ||
            disableButton
          }
          onClick={handleSubmit}
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
