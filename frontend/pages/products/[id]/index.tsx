import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../store/configureStore';
import Layout from '../../../components/Layout';
import {
  Grid,
  List,
  ListItem,
  Typography,
  Card,
  Button,
  Container,
  Avatar,
  Stack,
} from '@mui/material';
import Countdown from 'react-countdown';
import {
  BidOrder,
  NFTCollection,
  ModalType,
  TimeRendererProps,
  ListStatus,
  UserProfile,
  CollectionProfile,
} from '../../../common/types';
import ModalDialog from '../../../components/ModalDaialog';
import { openModal } from '../../../actions/modal.actions';
import { buyNowOrder } from '../../../service/order';
import { getMinter } from '../../../service/item';
import { GetServerSideProps } from 'next';
import ListModel from '../../../models/List';
import db from '../../../utils/db';
import { useSnackbar } from 'notistack';
import NFTImage from '../../../components/NFTImage';
import classes from '../../../utils/classes';
import { chains, nariveSymbol } from '../../../common/const';
import Bid from '../../../models/Bid';
import { useState } from 'react';
import { convertTimestamp } from '../../../common/date';
import User from '../../../models/User';
import NextLink from 'next/link';
import Image from 'next/image';
import Collection from '../../../models/Collection';
import { shortAddressOnly } from '../../../common/util';

type Props = {
  item: NFTCollection;
  bidOrders?: BidOrder[];
  bestBid?: BidOrder;
  minter: UserProfile;
  maker: UserProfile;
  collection: CollectionProfile;
};

const ItemView = ({ item, bidOrders, bestBid, minter, maker, collection }: Props) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const { isOpen } = useSelector((state: RootState) => state.modal);
  const currentUserAddress = useSelector((state: RootState) => state.currentUser);
  const chainId: number = parseInt(useSelector((state: RootState) => state.chainId));

  const [disableBuyButton, setDisableBuyButton] = useState(false);

  if (!item) {
    return (
      <Layout>
        <Container maxWidth='xl' sx={classes.main}>
          <div>No NFT found</div>
        </Container>
      </Layout>
    );
  }

  const renderer = ({ days, hours, minutes, seconds, completed }: TimeRendererProps) => {
    if (completed) {
      return <div>Time up</div>;
    } else {
      return (
        <span>
          {days}d {hours}h {minutes}m {seconds}s
        </span>
      );
    }
  };

  const createTimeRenderer = (unixtime: string): string => {
    const d: Date = new Date(parseInt(unixtime) * 1000);
    return d.toString();
  };

  const buyNow = async () => {
    setDisableBuyButton(true);
    const res = await buyNowOrder(item);
    if (res) {
      enqueueSnackbar('Successfully bought!', { variant: 'success' });
      router.push(`/about/${currentUserAddress}`);
    } else {
      enqueueSnackbar('Failed to buy!', { variant: 'error' });
    }
    setDisableBuyButton(false);
  };

  return (
    <Layout title={item.name} description={item.desc}>
      <Container maxWidth='xl' sx={classes.main}>
        <Grid container spacing={10}>
          <Grid sx={classes.mt1} item md={6} xs={12}>
            <NFTImage url={item.image} type={item.mimeType} />
          </Grid>
          <Grid item md={6} xs={12}>
            <List>
              <ListItem>
                <Typography sx={{ fontSize: '50px', fontWeight: 'bold' }}>{item.name}</Typography>
              </ListItem>
              <ListItem>
                <Typography sx={classes.productPageText}>Description</Typography>
              </ListItem>
              <ListItem>
                <Typography sx={{ fontSize: '18px', fontWeight: 'bold' }}>{item.desc}</Typography>
              </ListItem>
              <ListItem>
                <Typography sx={classes.productPageText}>Tags</Typography>
              </ListItem>
              <ListItem>
                {item.tags.map(
                  (tag) =>
                    tag !== '' && (
                      <Typography
                        key={tag}
                        sx={{ margin: '10px', fontSize: '25px', fontWeight: 'bold' }}
                      >
                        {tag}
                      </Typography>
                    ),
                )}
              </ListItem>
              <ListItem>
                <Typography
                  sx={{
                    fontSize: '18px',
                    fontWeight: 'bold',
                    color: '#999',
                    cursor: 'pointer',
                    textDecoration: 'none',
                    '&:hover': {
                      color: 'orange',
                    },
                  }}
                >
                  Collection
                </Typography>
              </ListItem>
              {collection && (
                <ListItem>
                  <NextLink href={`/collection/${collection.collectionId}`} passHref>
                    <Typography
                      sx={{
                        fontSize: '25px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        textDecoration: 'none',
                        '&:hover': {
                          color: 'orange',
                        },
                      }}
                    >
                      {collection.name}
                    </Typography>
                  </NextLink>
                </ListItem>
              )}
              <ListItem>
                <Typography sx={classes.productPageText}>Listed on</Typography>
              </ListItem>
              <ListItem>
                <Typography sx={{ fontSize: '25px', fontWeight: 'bold' }}>
                  {convertTimestamp(parseInt(item.listingTime) * 1000)}
                </Typography>
              </ListItem>
              <ListItem>
                <Stack direction='row' spacing={5}>
                  <Typography sx={classes.productPageText}>Listed by</Typography>
                  {maker && (
                    <NextLink href={`/about/${maker.address}`} passHref>
                      <Avatar
                        style={{
                          margin: '10px',
                        }}
                      >
                        {maker.profileImage && (
                          <Image
                            src={maker.profileImage}
                            height='40px'
                            width='40px'
                            alt='Profile Image'
                          />
                        )}
                      </Avatar>
                    </NextLink>
                  )}
                  <Typography sx={classes.productPageText}>Minted by</Typography>
                  {minter && (
                    <NextLink href={`/about/${minter.address}`} passHref>
                      <Avatar
                        style={{
                          margin: '10px',
                        }}
                      >
                        {minter.profileImage && (
                          <Image
                            src={minter.profileImage}
                            height='40px'
                            width='40px'
                            alt='Profile Image'
                          />
                        )}
                      </Avatar>
                    </NextLink>
                  )}
                </Stack>
              </ListItem>
            </List>
            <Card sx={{ borderRadius: '20px' }}>
              <List>
                <ListItem>
                  {item.auction.toString() == 'true' && (
                    <Grid container>
                      <Grid item xs={6}>
                        <Typography sx={classes.productPageText}>Base Price</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography sx={{ fontSize: '25px', fontWeight: 'bold' }}>
                          {item.price} {chains[chainId] && chains[chainId].auctionSymbol}
                        </Typography>
                      </Grid>
                    </Grid>
                  )}
                  {item.auction.toString() == 'false' && (
                    <Grid container>
                      <Grid item xs={6}>
                        <Typography sx={classes.productPageText}>Fixed Price</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography sx={{ fontSize: '25px', fontWeight: 'bold' }}>
                          {item.price}{' '}
                          {chains[chainId] ? chains[chainId].nativeSymbol : nariveSymbol}
                        </Typography>
                      </Grid>
                    </Grid>
                  )}
                </ListItem>
                {item.auction.toString() === 'true' && (
                  <ListItem>
                    <Grid container>
                      <Grid item xs={6}>
                        <Typography sx={classes.productPageText}>Time</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography sx={{ fontSize: '25px', fontWeight: 'bold' }}>
                          <Countdown
                            date={parseInt(item.expirationTime) * 1000}
                            renderer={renderer}
                          />
                        </Typography>
                      </Grid>
                    </Grid>
                  </ListItem>
                )}
                <ListItem>
                  {item.auction.toString() === 'true' &&
                    currentUserAddress &&
                    currentUserAddress.toLowerCase() !== item.maker.toLowerCase() && (
                      <Button
                        fullWidth
                        variant='contained'
                        color='primary'
                        disabled={parseInt(item.expirationTime) * 1000 <= Date.now()}
                        onClick={() => dispatch(openModal())}
                      >
                        Place Bid
                      </Button>
                    )}
                  {item.auction.toString() === 'false' &&
                    currentUserAddress &&
                    currentUserAddress.toLowerCase() !== item.maker.toLowerCase() && (
                      <Button
                        fullWidth
                        variant='contained'
                        color='primary'
                        onClick={buyNow}
                        disabled={disableBuyButton}
                      >
                        Buy Now
                      </Button>
                    )}
                </ListItem>
              </List>
            </Card>

            {bidOrders && bidOrders.length > 0 && (
              <Typography
                sx={{ fontSize: '18px', fontWeight: 'bold', color: '#999', marginTop: '40px' }}
              >
                Bids
              </Typography>
            )}
            {bidOrders &&
              bidOrders.length > 0 &&
              bidOrders.map((order) => (
                <Card key={order.createTime} style={{ marginTop: '10px', borderRadius: '20px' }}>
                  <List>
                    <ListItem>
                      <Grid container>
                        <Grid item xs={4}>
                          <Typography sx={classes.productPageText}>Price</Typography>
                        </Grid>
                        <Grid item xs={8}>
                          <Typography sx={{ fontSize: '25px', fontWeight: 'bold' }}>
                            {order.price} {chains[chainId] && chains[chainId].auctionSymbol}
                          </Typography>
                        </Grid>
                      </Grid>
                    </ListItem>
                    <ListItem>
                      <Grid container>
                        <Grid item xs={4}>
                          <Typography sx={classes.productPageText}>Bid placed by</Typography>
                        </Grid>
                        <Grid item xs={8}>
                          <Typography>{shortAddressOnly(order.taker)}</Typography>
                        </Grid>
                      </Grid>
                    </ListItem>
                    <ListItem>
                      <Grid container>
                        <Grid item xs={4}>
                          <Typography sx={classes.productPageText}>Created time</Typography>
                        </Grid>
                        <Grid item xs={8}>
                          <Typography>{createTimeRenderer(order.createTime)}</Typography>
                        </Grid>
                      </Grid>
                    </ListItem>
                  </List>
                </Card>
              ))}
          </Grid>
        </Grid>
        <ModalDialog
          isOpen={isOpen}
          item={item}
          bestBid={bestBid ? bestBid.price.toString() : '0'}
          type={ModalType.Price}
        />
      </Container>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ query }: { query: any }) => {
  await db.connect();

  const id = query.id;
  const nftAddress = id.split(':')[0];
  const tokenId = id.split(':')[1];

  const listDocs = await ListModel.find({ nftAddress, tokenId, status: ListStatus.Listing }).lean();
  const items = listDocs.map(db.convertDocToObj);
  const item = items[0];

  let bidOrders = null;
  let bestBid = null;
  let minter = null;
  let collection = null;
  let maker = null;
  if (item) {
    const bidDocs = await Bid.find({ parentId: item.listId }).lean();
    if (bidDocs && bidDocs.length > 0) {
      bidOrders = bidDocs.map(db.convertDocToObj);
    }

    minter = await getMinter(parseInt(item.tokenId));
    const userDoc = await User.find({ address: minter }).lean();
    if (userDoc && userDoc.length > 0) {
      minter = db.convertDocToObj(userDoc[0]);
    }

    const makerDoc = await User.find({ address: item.maker }).lean();
    if (makerDoc && makerDoc.length > 0) {
      maker = db.convertDocToObj(makerDoc[0]);
    }

    const collectionDoc = await Collection.find({ items: { $all: [item.listId] } }).lean();
    if (collectionDoc && collectionDoc.length > 0) {
      collection = db.convertDocToObj(collectionDoc[0]);
    }

    const bestBidDoc = await Bid.find({ parentId: item.listId })
      .sort({ price: -1 })
      .limit(1)
      .lean();
    if (bestBidDoc && bestBidDoc.length > 0) {
      bestBid = db.convertDocToObj(bestBidDoc[0]);
    }

    return { props: { item, bidOrders, bestBid, minter, maker, collection } };
  }

  return {
    props: {
      item: null,
      bidOrders: null,
      bestBid: null,
      minter: null,
      maker: null,
      collection: null,
    },
  };
};

export default ItemView;
