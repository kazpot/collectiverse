import { GetServerSideProps } from 'next';
import React from 'react';
import Layout from '../../../components/Layout';
import db from '../../../utils/db';
import { CollectionProfile, ModalType } from '../../../common/types';
import Image from 'next/image';
import { Avatar, Grid, Container, Stack, Typography, Box, Divider, Button } from '@mui/material';
import NextLink from 'next/link';
import Collection from '../../../models/Collection';
import NFTItemCard from '../../../components/card/NFTItemCard';
import classes from '../../../utils/classes';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store/configureStore';
import { useRouter } from 'next/router';
import { TwitterShareButton } from 'react-share';
import TwitterSmallIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import WebIcon from '../../../components/icon/WebIcon';
import DiscordIcon from '../../../components/icon/DiscordIcon';
import ModalDialog from '../../../components/ModalDaialog';
import { openModal } from '../../../actions/modal.actions';

type Props = {
  collection: CollectionProfile;
  averagePrice: string;
  tradeVolume: string;
};

const CollectionView = ({ collection, averagePrice, tradeVolume }: Props) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const currentUserAddress = useSelector((state: RootState) => state.currentUser);
  const { isOpen } = useSelector((state: RootState) => state.modal);

  if (!collection) {
    return (
      <Layout>
        <Container maxWidth='xl' sx={classes.main}>
          <div>No collection found</div>
        </Container>
      </Layout>
    );
  }

  const confirmationHandler = async () => {
    dispatch(openModal());
  };

  return (
    <Layout>
      {collection && collection.coverImage && (
        <div style={{ height: '450px', position: 'relative' }}>
          <Image src={collection.coverImage} layout='fill' alt='' />
        </div>
      )}
      <div
        style={{
          backgroundColor: 'rgba(0,0,0, 0)',
          position: 'absolute',
          left: '50px',
          top: '40px',
          color: 'white',
          fontSize: '40px',
        }}
      >
        <h1>{collection.name}</h1>
      </div>
      <div
        style={{
          backgroundColor: 'rgba(123,123,123,.5)',
          position: 'absolute',
          left: '50px',
          top: '290px',
          color: 'white',
          fontSize: '17px',
          width: '600px',
          borderRadius: '20px',
          padding: '10px',
        }}
      >
        {collection.description}
      </div>
      <NextLink href={`/about/${collection.user && collection.user[0].address}`} passHref>
        <div
          style={{
            position: 'absolute',
            color: 'white',
            fontSize: '20px',
            fontWeight: 'bold',
            top: '200px',
            left: '50px',
            backgroundColor: 'rgba(123,123,123,.5)',
            width: '250px',
            display: 'flex',
            alignItems: 'center',
            borderRadius: '30px',
          }}
        >
          <Avatar
            style={{
              margin: '10px',
            }}
          >
            {collection.user && collection.user[0].profileImage && (
              <Image
                src={collection.user && collection.user[0].profileImage}
                height='40px'
                width='40px'
                alt='Profile Image'
              />
            )}
          </Avatar>
          @{collection.user && collection.user[0].name}
        </div>
      </NextLink>
      <Container
        maxWidth='xl'
        sx={classes.main}
        style={{ marginTop: '20px', alignItems: 'center', justifyContent: 'center' }}
      >
        <Box
          sx={{
            borderRadius: '5px',
            border: '1px solid grey',
            width: '400px',
            margin: '20px',
            padding: '20px',
          }}
        >
          <Stack direction='row' spacing={2} divider={<Divider orientation='vertical' flexItem />}>
            <Typography>
              <span>Items of</span>
              <br />
              <span style={{ fontSize: '20px', fontWeight: 'bold' }}>
                {collection.items ? collection.items.length : '0'}
              </span>
            </Typography>
            <Typography>
              <span>Average price</span>
              <br />
              <span style={{ fontSize: '20px', fontWeight: 'bold' }}>{averagePrice} ETH</span>
            </Typography>
            <Typography>
              <span>Volume traded</span>
              <br />
              <span style={{ fontSize: '20px', fontWeight: 'bold' }}>{tradeVolume} ETH</span>
            </Typography>
          </Stack>
          <Stack direction='row' spacing={2} sx={{ marginTop: '20px' }}>
            {collection.webSite && (
              <a target='_blank' href={collection.webSite} rel='noopener noreferrer'>
                <WebIcon />
              </a>
            )}
            {collection.twitter && (
              <a
                target='_blank'
                href={`https://twitter.com/${collection.twitter}`}
                rel='noopener noreferrer'
              >
                <TwitterSmallIcon />
              </a>
            )}
            {collection.instagram && (
              <a
                target='_blank'
                href={`https://www.instagram.com/${collection.instagram}`}
                rel='noopener noreferrer'
              >
                <InstagramIcon />
              </a>
            )}
            {collection.discord && (
              <a
                target='_blank'
                href={`https://discordapp.com/users/${collection.discord}`}
                rel='noopener noreferrer'
              >
                <DiscordIcon />
              </a>
            )}
          </Stack>
          {collection.createdBy == currentUserAddress && (
            <Button
              onClick={() => router.push(`/edit-collection/${collection.collectionId}`)}
              sx={{
                border: '1px solid',
                borderRadius: '10px',
                marginTop: '20px',
                padding: '10px',
              }}
            >
              Edit Collection
            </Button>
          )}
          <TwitterShareButton
            url={`https://collectiverse.com${router.pathname.replace(
              '[id]',
              collection.collectionId,
            )}`}
            title={`Check out Collection "${collection.name}" on CollectiVerse!!`}
          >
            <Button
              sx={{
                border: '1px solid',
                borderRadius: '10px',
                marginTop: '20px',
                marginLeft: '20px',
                padding: '10px',
              }}
            >
              Share
            </Button>
          </TwitterShareButton>
          {collection.createdBy == currentUserAddress && (
            <Button
              onClick={confirmationHandler}
              sx={{
                border: '1px solid',
                borderRadius: '10px',
                marginLeft: '20px',
                marginTop: '20px',
                padding: '10px',
                color: 'red',
              }}
            >
              Delete
            </Button>
          )}
        </Box>
        <Grid container spacing={3}>
          {collection.items &&
            collection.items.length > 0 &&
            collection.items.map((item) => (
              <Grid item md={4} key={item.listingTime}>
                <NFTItemCard item={item} />
              </Grid>
            ))}
        </Grid>
      </Container>
      <ModalDialog isOpen={isOpen} type={ModalType.YesOrNo} collection={collection} />
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ query }: { query: any }) => {
  await db.connect();
  const collectionId = query.id;
  let collections = await Collection.aggregate([
    {
      $match: { collectionId },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'createdBy',
        foreignField: 'address',
        as: 'user',
      },
    },
    { $match: { items: { $exists: true } } },
    {
      $lookup: {
        from: 'lists',
        localField: 'items',
        foreignField: 'listId',
        pipeline: [
          {
            $match: {
              status: 'Listing',
            },
          },
        ],
        as: 'items',
      },
    },
  ]);

  let collectionsForSoldItems = await Collection.aggregate([
    {
      $match: { collectionId },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'createdBy',
        foreignField: 'address',
        as: 'user',
      },
    },
    { $match: { items: { $exists: true } } },
    {
      $lookup: {
        from: 'lists',
        localField: 'items',
        foreignField: 'listId',
        pipeline: [
          {
            $match: {
              status: 'Sold',
            },
          },
        ],
        as: 'items',
      },
    },
  ]);

  // calculate trade volume in collection
  let tradeVolume = '0';
  if (
    collectionsForSoldItems &&
    collectionsForSoldItems.length > 0 &&
    collectionsForSoldItems[0].items.length > 0
  ) {
    let sum = 0;
    const items = collectionsForSoldItems[0].items;
    for (let i = 0; i < items.length; i++) {
      sum += items[i].bestPrice ? items[i].bestPrice : items[i].price;
    }
    tradeVolume = sum.toFixed(2).toString();
  }

  // calculate average price in collection
  let averagePrice = '0';
  if (collections && collections.length > 0) {
    const colls = collections.map((coll) => {
      let collObj = db.convertDocToObj(coll);

      if (collObj.user && collObj.user.length > 0) {
        const users = collObj.user.map(db.convertDocToObj);
        collObj.user = users;
      }

      let sum = 0;
      if (collObj.items && collObj.items.length > 0) {
        const items = collObj.items.map(db.convertDocToObj);
        for (let i = 0; i < items.length; i++) {
          sum += items[i].bestPrice ? items[i].bestPrice : items[i].price;
        }
        collObj.items = items;
        averagePrice = (sum / items.length).toFixed(2).toString();
      }

      return collObj;
    });
    return { props: { collection: colls[0], averagePrice, tradeVolume } };
  }
  return { props: { collection: null, averagePrice: 0, tradeVolume: 0 } };
};

export default CollectionView;
