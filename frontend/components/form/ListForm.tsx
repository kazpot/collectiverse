import { useState } from 'react';
import { Button, Grid, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import { closeModal } from '../../actions/modal.actions';
import { useDispatch } from 'react-redux';
import { auctionTypes } from '../../common/const';
import { NFTCollection, UserItem, ListStatus, CollectionProfile } from '../../common/types';
import { list } from '../../service/order';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import { addItem } from '../../service/collection';

const current: Date = new Date();
const minDate: Date = new Date(
  new Date(current.setDate(current.getDate() + 1)).setHours(0, 0, 0, 0),
);
const maxDate: Date = new Date(
  new Date(current.setDate(current.getDate() + 30)).setHours(0, 0, 0, 0),
);

type ListFormProps = {
  userItem: UserItem;
  categoryOptions: string[];
  tagOptions: string[][];
  collections?: CollectionProfile[];
};

export default function ListForm({
  userItem,
  categoryOptions,
  tagOptions,
  collections,
}: ListFormProps) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const [expirationDate, setExpirationDate] = useState<Date>(minDate);
  const [errors, setErrors] = useState({ price: 'Must not be zero' } as any);
  const [disableButton, setDisableButton] = useState(false);
  const [itemProperty, setItemProperty] = useState({
    ...userItem,
    price: '',
    category: categoryOptions[0],
    auction: true,
    tags: [''],
    collectionId: '',
  });
  const [tags, setTags] = useState<string[]>([]);

  const handleChange = (e: any) => {
    if (e.target.name === 'price') {
      const price: number = e.target.value;
      if (price <= 0) {
        setErrors({ ...errors, price: 'price must be greater than 0' });
      } else {
        setErrors({ ...errors, price: '' });
      }
    } else if (e.target.name === 'name' || e.target.name === 'description') {
      if (!e.target.value) {
        setErrors({ ...errors, [e.target.name]: 'must not be empty' });
      } else {
        setErrors({ ...errors, [e.target.name]: '' });
      }
    }
    setItemProperty((prevProp) => {
      return {
        ...prevProp,
        [e.target.name]: e.target.value,
      };
    });
  };

  const changeDateHandler = (e: any): void => {
    const expDate = new Date(e.target.value);
    if (expDate < minDate || expDate > maxDate) {
      setErrors({ ...errors, expiration: 'invalid date' });
    } else {
      setErrors({ ...errors, expiration: '' });
    }
    const newDate: Date = e.target.value;
    setExpirationDate(newDate);
  };

  const tagsHandler = async (_event: any, value: string[]) => {
    const tags = value;
    if (tags.length > 2) {
      return;
    }
    setTags(tags);
    setItemProperty({ ...itemProperty, tags });
  };

  const handleSubmit = async (e: any) => {
    setDisableButton(true);
    e.preventDefault();
    const {
      price,
      category,
      auction,
      nftAddress,
      owner,
      tokenId,
      tokenUri,
      image,
      name,
      desc,
      mimeType,
      collectionId,
    } = itemProperty;
    if (!price || price == '0' || !category) {
      enqueueSnackbar('Failed to submit. Please check input!', { variant: 'error' });
      return;
    }

    const expirationTimeInMiliSec = expirationDate
      ? new Date(expirationDate).getTime() - 9 * 60 * 60 * 1000
      : 0;
    const expirationTime = Math.floor(expirationTimeInMiliSec / 1000).toString();
    const item: NFTCollection = {
      nftAddress,
      minter: owner,
      tokenId: tokenId.toString(),
      price,
      expirationTime,
      auction,
      category,
      tags,
      image,
      ipfs: tokenUri,
      name,
      desc,
      mimeType,
      mintTime: '0',
      listId: '',
      hash: '',
      maker: '',
      bestPrice: '',
      bestBidder: '',
      bestBidHash: '',
      listingTime: '',
      status: ListStatus.Listing,
    };
    const { result, listTxHash, listedItem, reason } = await list(item);
    if (result && listTxHash != null && listedItem != null) {
      // if collection (optional) is selected, the item will be added to collection
      if (collectionId) {
        const res = await addItem(listedItem.listId, collectionId);
        console.log('Added to collection:', res);
      }

      enqueueSnackbar(`Successfully listed! => tx: ${listTxHash}`, { variant: 'success' });
      dispatch(closeModal());
      router.push(`/products/${nftAddress}:${tokenId}`);
    } else {
      enqueueSnackbar('Failed to list!' + reason ? ` reason: ${reason}` : '', { variant: 'error' });
      dispatch(closeModal());
    }
  };

  return (
    <Grid container spacing={3} direction='column' alignItems='center' justifyContent='center'>
      <Grid item xs={12}>
        <InputLabel id='category-select-label'>Category</InputLabel>
        <Select
          name='category'
          value={itemProperty.category ? itemProperty.category : categoryOptions[0]}
          labelId='category-select-label'
          variant='outlined'
          onChange={handleChange}
          style={{
            fontSize: 20,
            width: 350,
            height: 50,
          }}
        >
          {categoryOptions.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </Grid>
      <Grid item xs={12}>
        <InputLabel id='auction-select-label'>Auction</InputLabel>
        <Select
          name='auction'
          value={itemProperty.auction ? itemProperty.auction : auctionTypes[0].value}
          labelId='auction-select-label'
          variant='outlined'
          onChange={handleChange}
          style={{
            fontSize: 20,
            width: 350,
            height: 50,
          }}
        >
          {auctionTypes.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </Grid>
      <Grid item xs={12}>
        <InputLabel id='collection-select-label'>Collection (Optional)</InputLabel>
        <Select
          name='collectionId'
          value={itemProperty.collectionId ? itemProperty.collectionId : ''}
          labelId='collection-select-label'
          variant='outlined'
          onChange={handleChange}
          style={{
            fontSize: 20,
            width: 350,
            height: 50,
          }}
        >
          {collections &&
            collections.map((option) => (
              <MenuItem key={option.collectionId} value={option.collectionId}>
                {option.name}
              </MenuItem>
            ))}
        </Select>
      </Grid>
      <Grid item xs={12}>
        <Typography marginLeft='80px' color='#696969'>
          Tags (max: 2 tags)
        </Typography>
        {tagOptions &&
          tagOptions.map((options: string[], index) => (
            <ToggleButtonGroup
              key={index}
              color='primary'
              value={tags}
              onChange={tagsHandler}
              sx={{ margin: '10px', display: 'flex' }}
            >
              {options.map((option: string) => (
                <ToggleButton key={option} value={option}>
                  {option}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          ))}
      </Grid>
      {itemProperty.auction.toString() == 'true' && (
        <Grid item xs={12}>
          <TextField
            name='expiration'
            type='date'
            label='Expiration Date'
            required
            variant='filled'
            inputProps={{
              style: {
                fontSize: 20,
                width: 350,
                height: 50,
              },
            }}
            onChange={changeDateHandler}
            {...(errors['expiration'] && { error: true, helperText: errors['expiration'] })}
          />
        </Grid>
      )}
      <Grid item xs={12}>
        <TextField
          name='price'
          type='number'
          label='Asset Price'
          required
          variant='filled'
          inputProps={{
            min: 0,
            step: '0.01',
            style: {
              min: 0.01,
              width: 350,
              fontSize: 20,
            },
          }}
          onChange={handleChange}
          defaultValue={0}
          {...(errors['price'] && { error: true, helperText: errors['price'] })}
        />
      </Grid>
      <Grid item xs={12}>
        <Button
          style={{ margin: '10px' }}
          type='submit'
          variant='contained'
          onClick={handleSubmit}
          disabled={
            errors['name'] ||
            errors['discription'] ||
            errors['price'] ||
            errors['expiration'] ||
            errors['discription'] ||
            disableButton
          }
        >
          {'List'}
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
