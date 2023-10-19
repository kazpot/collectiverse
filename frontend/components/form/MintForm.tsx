import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { mint, list, isApproved } from '../../service/order';
import {
  Button,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  LinearProgress,
  Box,
  Link,
  Typography,
} from '@mui/material';
import { auctionTypes } from '../../common/const';
import { useSnackbar } from 'notistack';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import NFTImage from '../NFTImage';
import { CollectionProfile, ModalType } from '../../common/types';
import ModalDialog from '../ModalDaialog';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/configureStore';
import { closeModal, openModal } from '../../actions/modal.actions';
import { addItem } from '../../service/collection';
import NextLink from 'next/link';
import { client, ipfsFileUrl } from '../../common/ipfs';

const current: Date = new Date();
const minDate: Date = new Date(
  new Date(current.setDate(current.getDate() + 1)).setHours(0, 0, 0, 0),
);
const maxDate: Date = new Date(
  new Date(current.setDate(current.getDate() + 30)).setHours(0, 0, 0, 0),
);

type Props = {
  tagOptions: string[][];
  categoryOptions: string[];
  collections?: CollectionProfile[];
};

export default function MintForm({ tagOptions, categoryOptions, collections }: Props) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();

  const { isOpen } = useSelector((state: RootState) => state.modal);

  const [fileType, setFileType] = useState('');
  const [expirationDate, setExpirationDate] = useState<Date>(minDate);
  const [errors, setErrors] = useState({ price: 'Must not be zero' } as any);
  const [activeStep, setActiveStep] = useState(0);
  const [itemProperty, setItemProperty] = useState({
    price: '',
    name: '',
    category: categoryOptions[0],
    fileUrl: '',
    description: '',
    auction: true,
    tags: [''],
    collectionId: '',
  });
  const [tags, setTags] = useState<string[]>([]);
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    async function init() {
      try {
        const res = await isApproved();
        if (!res) {
          router.push('/');
        }
      } catch (e: any) {
        console.log(e);
        router.push('/');
      }
    }
    init();
  });

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
    if (expDate < minDate) {
      setErrors({ ...errors, expiration: 'date must be later than tomorrow' });
    } else if (expDate > maxDate) {
      setErrors({ ...errors, expiration: 'date must be within 1 month' });
    } else {
      setErrors({ ...errors, expiration: '' });
    }
    const newDate: Date = e.target.value;
    setExpirationDate(newDate);
  };

  const imageHandler = async (e: any) => {
    const file = e.target.files[0];
    setFileType(file.type);
    if (!file) {
      setErrors({ ...errors, image: 'invalid image' });
      return;
    } else {
      setErrors({ ...errors, image: '' });
    }

    // max file size = 50 MB
    if (file.size > 52428800) {
      setErrors({ ...errors, image: 'must be smaller than 50 MB' });
      return;
    }

    try {
      const added = await client.add(file, {
        progress: (prog) => {
          console.log(`received: ${prog}, size: ${file.size}`);
          console.log(Math.floor((prog / file.size) * 100));
          setProgress(Math.floor((prog / file.size) * 100));
        },
      });
      const fileUrl = `${ipfsFileUrl}${added.path}`;
      setItemProperty({ ...itemProperty, fileUrl });
    } catch (error) {
      enqueueSnackbar('Error uploading file', { variant: 'error' });
    }
  };

  const tagsHandler = async (event: any, value: string[]) => {
    const tags = value;
    if (tags.length > 2) {
      return;
    }
    setTags(tags);
    setItemProperty({ ...itemProperty, tags });
  };

  const handleSubmit = async () => {
    setActiveStep(1);
    dispatch(openModal());
    const { name, description, price, fileUrl, category, auction, tags, collectionId } =
      itemProperty;

    if (!name || !description || !price || price == '0' || !fileUrl) {
      enqueueSnackbar('Failed to submit. Please check input (name, description, price, image)!', {
        variant: 'error',
      });
      dispatch(closeModal());
      return;
    }

    if (tags.length > 2) {
      enqueueSnackbar('Failed to submit. Max number of tag is 2!', { variant: 'error' });
      dispatch(closeModal());
      return;
    }

    const data: string = JSON.stringify({
      name,
      description,
      image: fileUrl,
    });
    try {
      const added = await client.add(data);
      const ipfsFilePathUrl = `${ipfsFileUrl}${added.path}`;

      // unixtime - 9h
      const expirationTimeInMiliSec = expirationDate
        ? new Date(expirationDate).getTime() - 9 * 60 * 60 * 1000
        : 0;

      // mint NFT
      const { nftCollection, result, mintTxHash } = await mint(
        fileUrl,
        name,
        description,
        ipfsFilePathUrl,
        price,
        expirationTimeInMiliSec,
        auction,
        category,
        fileType,
        tags,
      );

      if (result && nftCollection != null && mintTxHash != null) {
        setActiveStep(2);
        enqueueSnackbar(`Successfully minted! => tx: ${mintTxHash}`, { variant: 'success' });

        // list NFT
        const { result, listTxHash, listedItem } = await list(nftCollection);
        if (result && listTxHash != null && listedItem != null) {
          // if collection (optional) is selected, the item will be added to collection
          if (collectionId) {
            const res = await addItem(listedItem.listId, collectionId);
            console.log('Added to collection:', res);
          }

          enqueueSnackbar(`Successfully listed! => tx: ${listTxHash}`, { variant: 'success' });
          dispatch(closeModal());
          router.push(`/products/${nftCollection.nftAddress}:${nftCollection?.tokenId}`);
        } else {
          enqueueSnackbar('Failed to list!', { variant: 'error' });
          dispatch(closeModal());
          return;
        }
      } else {
        enqueueSnackbar('Failed to mint!', { variant: 'error' });
        dispatch(closeModal());
        return;
      }
    } catch (error) {
      dispatch(closeModal());
      enqueueSnackbar('Failed!', { variant: 'error' });
    }
  };

  return (
    <div>
      <Grid container spacing={1}>
        <Grid item md={6} xs={12}>
          <Grid container spacing={3} alignItems='center' justifyContent='center'>
            <Grid item xs={12}>
              <div style={{ marginLeft: '15px' }}>
                <h1>Create your NFT</h1>
              </div>
              <Box sx={{ marginTop: '40px' }}>
                <NFTImage url={itemProperty.fileUrl} type={fileType} />
              </Box>
              <Box sx={{ width: '600px', margin: '20px' }}>
                <LinearProgress variant='determinate' value={progress} />
              </Box>
            </Grid>
          </Grid>
        </Grid>
        <Grid item md={6} xs={12}>
          <Grid
            container
            spacing={3}
            direction='column'
            alignItems='center'
            justifyContent='center'
            style={{ marginTop: '80px' }}
          >
            <Grid item xs={12}>
              <TextField
                key='test'
                name='image'
                type='file'
                required
                variant='filled'
                inputProps={{
                  accept: 'image/jpeg,image/png,image/gif,image/svg+xml,video/mp4',
                  style: {
                    fontSize: 20,
                    width: 600,
                    height: 50,
                  },
                }}
                onChange={imageHandler}
                {...(errors['image'] && { error: true, helperText: errors['image'] })}
              />
            </Grid>
            <Typography variant='caption'>Recommended size: 1500x1500px</Typography>
            <Grid item xs={12}>
              <TextField
                name='name'
                type='string'
                label='Asset Name'
                placeholder='No more than 15 characters'
                required
                variant='filled'
                inputProps={{
                  maxLength: 15,
                  style: {
                    fontSize: 20,
                    width: 600,
                  },
                }}
                onChange={handleChange}
                {...(errors['name'] && { error: true, helperText: errors['name'] })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name='description'
                type='string'
                label='Discription'
                placeholder='No more than 400 characters'
                multiline
                maxRows={4}
                required
                variant='filled'
                inputProps={{
                  maxLength: 400,
                  style: {
                    fontSize: 20,
                    width: 600,
                    height: 200,
                  },
                }}
                onChange={handleChange}
                {...(errors['description'] && { error: true, helperText: errors['description'] })}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography marginLeft='10px' color='#696969'>
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
            <Grid item xs={12}>
              <InputLabel id='collection-select-label'>Collection</InputLabel>
              <Select
                name='collectionId'
                value={itemProperty.collectionId ? itemProperty.collectionId : ''}
                labelId='collection-select-label'
                variant='outlined'
                onChange={handleChange}
                style={{
                  fontSize: 20,
                  width: 600,
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
            <NextLink href='/create-collection' passHref>
              <Link style={{ textDecoration: 'none' }}>
                <Typography>Create a new collection</Typography>
              </Link>
            </NextLink>
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
                  width: 600,
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
                  width: 600,
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
                      width: 600,
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
                  min: '0.01',
                  step: '0.01',
                  style: {
                    width: 600,
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
                variant='contained'
                onClick={handleSubmit}
                disabled={
                  errors['name'] ||
                  errors['discription'] ||
                  errors['price'] ||
                  errors['expiration'] ||
                  errors['image']
                    ? true
                    : false
                }
              >
                {'Mint & List'}
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <ModalDialog isOpen={isOpen} type={ModalType.MintAndList} activeStep={activeStep} />
    </div>
  );
}
