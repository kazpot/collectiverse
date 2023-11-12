import { useState } from 'react';
import { Box, Button, Grid, Tab, Tabs, Typography, TextField } from '@mui/material';
import Layout from '../../../components/Layout';
import OwnAssets from '../../../components/OwnAssets';
import UserDashboard from '../../../components/UserDashboard';
import CollectionBoard from '../../../components/CollectionBoard';
import Profile from '../../../components/Profile';
import Category from '../../../models/Category';
import Tag from '../../../models/Tag';
import db from '../../../utils/db';
import { GetServerSideProps } from 'next';
import { splitIntoChunks } from '../../../common/util';
import PropTypes from 'prop-types';
import { getUserProfile } from '../../../service/user';
import {
  UserProfile,
  CollectionProfile,
  UserItem,
  ListStatus,
  NFTCollection,
} from '../../../common/types';
import Image from 'next/image';
import classes from '../../../utils/classes';
import Collection from '../../../models/Collection';
import Nft from '../../../models/Nft';
import { getUserItemsByTokenIds, updateOwnedItems } from '../../../service/item';
import List from '../../../models/List';
import { ethers } from 'ethers';
import { useSnackbar } from 'notistack';

function TabPanel(props: any) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`wrapped-tabpanel-${index}`}
      aria-labelledby={`wrapped-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index: number) {
  return {
    id: `wrapped-tab-${index}`,
    'aria-controls': `wrapped-tabpanel-${index}`,
  };
}

type Props = {
  userProfile: UserProfile;
  tagOptions: string[][];
  categoryOptions: string[];
  collections: CollectionProfile[];
  userItems: UserItem[];
  listingItems: NFTCollection[];
};

const Assets = ({
  userProfile,
  tagOptions,
  categoryOptions,
  collections,
  userItems,
  listingItems,
}: Props) => {
  const { enqueueSnackbar } = useSnackbar();

  const [tab, setTab] = useState(0);
  const [itemProperty, setItemProperty] = useState({} as any);

  const handleTabChange = (e: any, newValue: number) => {
    setTab(newValue);
  };

  const handleChange = (e: any) => {
    setItemProperty((prevProp: any) => {
      return {
        ...prevProp,
        [e.target.name]: e.target.value,
      };
    });
  };

  const updateHandler = async () => {
    let nftAddress = null;
    if (itemProperty.nftAddress) {
      try {
        nftAddress = ethers.utils.getAddress(itemProperty.nftAddress);
      } catch (error) {
        enqueueSnackbar('NFT address is invalid!', { variant: 'error' });
        return;
      }
    }

    const res = await updateOwnedItems(userProfile.address, nftAddress);
    if (res) {
      enqueueSnackbar('Successfully updated!', { variant: 'success' });
      window.location.reload();
    } else {
      enqueueSnackbar('Failed to update!', { variant: 'error' });
    }
  };

  if (userProfile == null) {
    return (
      <Layout>
        <Grid sx={classes.mt1} container spacing={1}>
          <Grid item md={3}>
            <div>User not found...</div>
          </Grid>
        </Grid>
      </Layout>
    );
  }

  return (
    <Layout>
      <div>
        {userProfile && userProfile.coverImage ? (
          <div style={{ height: '350px', position: 'relative' }}>
            <Image src={userProfile.coverImage} layout='fill' alt='' />
          </div>
        ) : (
          <div
            style={{
              backgroundImage: `url(${userProfile.profileImage ? userProfile.profileImage : ''})`,
              filter: 'blur(8px)',
              height: '350px',
              marginTop: '10px',
              marginBottom: '10px',
              backgroundRepeat: 'space',
              backgroundPosition: 'center',
            }}
          />
        )}
        <Grid container spacing={1}>
          <Grid item md={3}>
            <Profile userProfile={userProfile} />
          </Grid>
          <Grid item md={9} sx={{ marginTop: '20px' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={tab} onChange={handleTabChange} aria-label='basic tabs example'>
                <Tab label={<span style={{ fontSize: '25px' }}>Owned</span>} {...a11yProps(0)} />
                <Tab label={<span style={{ fontSize: '25px' }}>Created</span>} {...a11yProps(1)} />
                <Tab
                  label={<span style={{ fontSize: '25px' }}>Collections</span>}
                  {...a11yProps(2)}
                />
              </Tabs>
            </Box>
            <TabPanel value={tab} index={0}>
              <Button
                onClick={updateHandler}
                variant='outlined'
                sx={{
                  backgroundColor: 'white',
                  color: 'black',
                  width: '100px',
                  fontSize: '15px',
                  margin: '8px',
                  borderColor: 'black',
                  '&:hover': {
                    background: '#fcfcfc',
                  },
                }}
              >
                Update
              </Button>
              <TextField
                label='Optional'
                name='nftAddress'
                type='string'
                value={itemProperty.nftAddress}
                placeholder='NFT address to be imported (42 characters starting with 0x)'
                //variant='filled'
                inputProps={{
                  maxLength: 42,
                  style: {
                    fontSize: 12,
                    width: 600,
                  },
                }}
                onChange={handleChange}
                //{...(errors['nftAddress'] && { error: true, helperText: errors['nftAddress'] })}
              />
              <OwnAssets
                userProfile={userProfile}
                tagOptions={tagOptions}
                categoryOptions={categoryOptions}
                collections={collections}
                userItems={userItems}
              />
            </TabPanel>
            <TabPanel value={tab} index={1}>
              <UserDashboard items={listingItems} />
            </TabPanel>
            <TabPanel value={tab} index={2}>
              <CollectionBoard collections={collections} userProfile={userProfile} />
            </TabPanel>
          </Grid>
        </Grid>
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ query }: { query: any }) => {
  await db.connect();
  const userAddress = ethers.utils.getAddress(query.id);
  const userProfile = await getUserProfile(userAddress);

  // collections
  let collections = null;
  const collectionDoc = await Collection.find({ createdBy: userAddress }).lean();
  if (collectionDoc && collectionDoc.length > 0) {
    collections = collectionDoc.map(db.convertDocToObj);
  }

  // user owned items
  let userItems: UserItem[] | null = null;
  const nftDoc = await Nft.find({ owner: userAddress }).lean();
  if (nftDoc && nftDoc.length > 0) {
    const nfts = nftDoc.map(db.convertDocToObj);
    userItems = await getUserItemsByTokenIds(userAddress, nfts);
  }

  // listing or cenceled items
  let items: NFTCollection[] | null = null;
  const itemDoc = await List.find({
    maker: userAddress,
    $or: [{ status: ListStatus.Listing }, { status: ListStatus.Canceled }],
  }).lean();
  if (itemDoc && itemDoc.length > 0) {
    items = itemDoc.map(db.convertDocToObj);
  }

  // only listing items
  let listingItems: NFTCollection[] | null = null;
  listingItems = items ? items.filter((item) => item.status == ListStatus.Listing) : null;

  // Add listing status to the user owned items
  const UserItemsWithListingStatus =
    userItems &&
    userItems.map((userItem) => {
      const listing =
        items &&
        items.some((item) => {
          return (
            userItem.nftAddress === item.nftAddress &&
            userItem.tokenId.toString() === item.tokenId.toString() &&
            item.status === ListStatus.Listing
          );
        });
      return { ...userItem, listing };
    });

  // tags
  const tagDoc = await Tag.find();
  const tagOptions = tagDoc.map((tag) => tag.value);
  const splitOptions = splitIntoChunks(tagOptions, 5);

  // category
  const categoryDoc = await Category.find();
  const categoryOptions = categoryDoc.map((cat) => cat.value);

  return {
    props: {
      userProfile,
      tagOptions: splitOptions,
      categoryOptions,
      collections,
      userItems: UserItemsWithListingStatus,
      items,
      listingItems,
    },
  };
};

export default Assets;
