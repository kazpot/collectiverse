import { Box, Button, Container, Grid, List, MenuItem, Select, Typography } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import { ListItem, Pagination, Tab, Tabs } from '@mui/material';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import db from '../utils/db';
import NFTItemCard from '../components/card/NFTItemCard';
import Category from '../models/Category';
import Tag from '../models/Tag';
import classes from '../utils/classes';
import ListModel from '../models/List';
import CollectionModel from '../models/Collection';
import UserModel from '../models/User';
import PropTypes from 'prop-types';
import { useState } from 'react';
import CollectionCard from '../components/card/CollectionCard';
import { CollectionProfile, NFTCollection, UserProfile, ListStatus } from '../common/types';
import UserCard from '../components/card/UserCard';
import { useSelector } from 'react-redux';
import { RootState } from '../store/configureStore';

const PAGE_SIZE = 12;

const prices = [
  {
    name: '$0 to $1',
    value: '0-1',
  },
  {
    name: '$1 to $10',
    value: '1-10',
  },
  {
    name: '$10 to $100',
    value: '10-100',
  },
  {
    name: '$100 to $1000',
    value: '100-1000',
  },
];

interface Prop {
  categories: string[];
  tags: string[];
  items: NFTCollection[];
  activeItems: NFTCollection[];
  colls: CollectionProfile[];
  users: UserProfile[];
  listPage: number;
  listCount: number;
  activeListCount: number;
  listPages: number;
  collectionPage: number;
  collectionCount: number;
  collectionPages: number;
  userPage: number;
  userCount: number;
  userPages: number;
  tabPage: string;
}

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

const Search = (props: Prop) => {
  const router = useRouter();

  const currentUserAddress = useSelector((state: RootState) => state.currentUser);

  const {
    categories,
    tags,
    items,
    activeItems,
    colls,
    users,
    listPage,
    listCount,
    activeListCount,
    listPages,
    collectionPage,
    collectionCount,
    collectionPages,
    userPage,
    userCount,
    userPages,
    tabPage,
  } = props;

  const [tab, setTab] = useState(parseInt(tabPage));

  const handleTabChange = (e: any, newValue: number) => {
    setTab(newValue);
  };

  const {
    query = 'all',
    category = 'all',
    tag = 'all',
    price = 'all',
    sort = 'newest',
  } = router.query;

  const filterSearch = ({
    listPage,
    collectionPage,
    userPage,
    category,
    tag,
    min,
    max,
    searchQuery,
    price,
    sort,
    tabPage,
  }: {
    listPage?: number;
    collectionPage?: number;
    userPage?: number;
    category?: string;
    tag?: string;
    min?: number;
    max?: number;
    searchQuery?: string;
    price?: string;
    sort?: string;
    tabPage?: number;
  }) => {
    const path = router.pathname;
    const { query } = router;
    if (listPage) query.listPage = listPage.toString();
    if (collectionPage) query.collectionPage = collectionPage.toString();
    if (userPage) query.userPage = userPage.toString();
    if (category) query.category = category;
    if (tag) query.tag = tag;
    if (searchQuery) query.searchQuery = searchQuery;
    if (price) query.price = price;
    if (min) query.min ? query.min : query.min === '0' ? 0 : min;
    if (max) query.max ? query.max : query.max === '0' ? 0 : max;
    if (sort) query.sort = sort;
    query.tabPage = tabPage ? tabPage.toString() : '0';

    router.push({
      pathname: path,
      query: query,
    });
  };

  const categoryHandler = (e: any) => {
    filterSearch({ category: e.target.value });
  };

  const tagHandler = (e: any) => {
    filterSearch({ tag: e.target.value });
  };

  const listPageHandler = (_: any, listPage: number) => {
    filterSearch({ listPage, tabPage: tab });
  };

  const collectionPageHandler = (_: any, collectionPage: number) => {
    filterSearch({ collectionPage, tabPage: tab });
  };

  const userPageHandler = (_: any, userPage: number) => {
    filterSearch({ userPage, tabPage: tab });
  };

  const sortHandler = (e: any) => {
    filterSearch({ sort: e.target.value });
  };

  const priceHandler = (e: any) => {
    filterSearch({ price: e.target.value });
  };

  return (
    <Layout>
      <Container maxWidth='xl' sx={classes.main}>
        <h1>Explore</h1>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tab} onChange={handleTabChange} aria-label='basic tabs example'>
            <Tab label={<span style={{ fontSize: '25px' }}>NFTs</span>} {...a11yProps(0)} />
            <Tab label={<span style={{ fontSize: '25px' }}>Collections</span>} {...a11yProps(1)} />
            <Tab label={<span style={{ fontSize: '25px' }}>Profiles</span>} {...a11yProps(2)} />
          </Tabs>
        </Box>
        <TabPanel value={tab} index={0}>
          <Grid sx={classes.mt1} container>
            <Grid item md={3}>
              <List>
                <ListItem>
                  <Box sx={classes.fullWidth}>
                    <Typography>Category</Typography>
                    <Select fullWidth value={category} onChange={categoryHandler}>
                      <MenuItem value='all'>All</MenuItem>
                      {categories &&
                        categories.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                    </Select>
                  </Box>
                </ListItem>
                <ListItem>
                  <Box sx={classes.fullWidth}>
                    <Typography>Prices</Typography>
                    <Select fullWidth value={price} onChange={priceHandler}>
                      <MenuItem value='all'>All</MenuItem>
                      {prices.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </Box>
                </ListItem>
                <ListItem>
                  <Box sx={classes.fullWidth}>
                    <Typography>Tags</Typography>
                    <Select fullWidth value={tag} onChange={tagHandler}>
                      <MenuItem value='all'>All</MenuItem>
                      {tags.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                  </Box>
                </ListItem>
              </List>
            </Grid>
            <Grid item md={9}>
              <Grid container justifyContent='space-between' alignItems='center'>
                <Grid item>
                  {items.length === 0 || !currentUserAddress ? '' : `${listCount} Results`}
                  {activeItems.length !== 0 && !currentUserAddress
                    ? `${activeListCount} Results`
                    : ''}
                  {query !== 'all' && query !== '' && ' : ' + query}
                  {category !== 'all' && ' : ' + category}
                  {tag !== 'all' && ' : ' + tag}
                  {price !== 'all' && ' : ' + price}
                  {(query !== 'all' && query !== '') ||
                  category !== 'all' ||
                  price !== 'all' ||
                  tag !== 'all' ? (
                    <Button onClick={() => router.push('/search')}>
                      <CancelIcon />
                    </Button>
                  ) : null}
                </Grid>
                <Grid item>
                  <Typography component='span' sx={classes.sort}>
                    Sort by
                  </Typography>
                  <Select value={sort} onChange={sortHandler}>
                    <MenuItem value='newest'>Date Created: Newest</MenuItem>
                    <MenuItem value='oldest'>Date Created: Oldest</MenuItem>
                    <MenuItem value='minted-newest'>Date Minted: Newest</MenuItem>
                    <MenuItem value='minted-oldest'>Date Minted: Oldest</MenuItem>
                    <MenuItem value='lowest'>Price: Low to High</MenuItem>
                    <MenuItem value='higest'>Price High to Low</MenuItem>
                  </Select>
                </Grid>
              </Grid>
              <Grid sx={classes.mt1} container spacing={3}>
                {items.length > 0 &&
                  currentUserAddress &&
                  items.map((item: any) => (
                    <Grid item md={4} key={item.listingTime}>
                      <NFTItemCard item={item} />
                    </Grid>
                  ))}
                {activeItems.length > 0 &&
                  !currentUserAddress &&
                  activeItems.map((item: any) => (
                    <Grid item md={4} key={item.listingTime}>
                      <NFTItemCard item={item} />
                    </Grid>
                  ))}
              </Grid>

              <Pagination
                sx={classes.mt1}
                defaultPage={listPage ? parseInt(listPage.toString()) : 1}
                count={listPages}
                variant='outlined'
                color='primary'
                onChange={listPageHandler}
              />
            </Grid>
          </Grid>
        </TabPanel>
        <TabPanel value={tab} index={1}>
          <Grid sx={classes.mt1} container spacing={3}>
            <Grid item>
              {colls.length === 0 ? 'No' : collectionCount} Results
              {query !== 'all' && query !== '' && ' : ' + query}
              {query !== 'all' && query !== '' ? (
                <Button onClick={() => router.push('/search')}>
                  <CancelIcon />
                </Button>
              ) : null}
            </Grid>
            <Grid sx={classes.mt1} container spacing={3}>
              {colls.length > 0 &&
                colls.map((coll: CollectionProfile) => (
                  <Grid item md={3} key={coll.collectionId}>
                    <CollectionCard collection={coll} />
                  </Grid>
                ))}
            </Grid>
            <Pagination
              sx={classes.mt1}
              defaultPage={collectionPage ? parseInt(collectionPage.toString()) : 1}
              count={collectionPages}
              variant='outlined'
              color='primary'
              onChange={collectionPageHandler}
            />
          </Grid>
        </TabPanel>
        {currentUserAddress && (
          <TabPanel value={tab} index={2}>
            <Grid sx={classes.mt1} container spacing={3}>
              <Grid item>
                {users.length === 0 ? 'No' : userCount} Results
                {query !== 'all' && query !== '' && ' : ' + query}
                {query !== 'all' && query !== '' ? (
                  <Button onClick={() => router.push('/search')}>
                    <CancelIcon />
                  </Button>
                ) : null}
              </Grid>
              <Grid sx={classes.mt1} container spacing={3}>
                {users.length > 0 &&
                  users.map((user: UserProfile) => (
                    <Grid item md={3} key={user.username}>
                      <UserCard user={user} />
                    </Grid>
                  ))}
              </Grid>
              <Pagination
                sx={classes.mt1}
                defaultPage={userPage ? parseInt(userPage.toString()) : 1}
                count={userPages}
                variant='outlined'
                color='primary'
                onChange={userPageHandler}
              />
            </Grid>
          </TabPanel>
        )}
      </Container>
    </Layout>
  );
};

export default Search;

export const getServerSideProps = async ({ query }: { query: any }) => {
  await db.connect();
  const pageSize = query.pageSize || PAGE_SIZE;
  const listPage = query.listPage || 1;
  const collectionPage = query.collectionPage || 1;
  const userPage = query.userPage || 1;
  const category = query.category || '';
  const tag = query.tag || '';
  const price = query.price || 0;
  const sort = query.sort || '';
  const searchQuery = query.query || '';
  const tabPage = query.tabPage || 0;

  const queryFilter =
    searchQuery && searchQuery !== 'all'
      ? {
          name: {
            $regex: searchQuery,
            $options: 'i',
          },
        }
      : {};

  const categoryFilter = category && category != 'all' ? { category } : {};

  const t = tag != 'all' ? tag.toUpperCase() : tag;
  const tagFilter = tag && tag != 'all' ? { tags: { $all: [t] } } : {};

  const priceFilter =
    price && price !== 'all'
      ? {
          price: {
            $gte: Number(price.split('-')[0]),
            $lte: Number(price.split('-')[1]),
          },
        }
      : {};

  const order =
    sort === 'lowest'
      ? { price: 1 }
      : sort === 'highest'
      ? { price: -1 }
      : sort === 'oldest'
      ? { createdAt: 1 }
      : sort === 'newest'
      ? { createdAt: -1 }
      : sort === 'minted-oldest'
      ? { mintTime: 1 }
      : sort === 'minted-newest'
      ? { mintTime: -1 }
      : { _id: -1 };

  // categories
  const categoryDoc = await Category.find();
  const categories = categoryDoc.map((cat) => cat.value);

  // tags
  const tagDoc = await Tag.find();
  const tags = tagDoc.map((tag) => tag.value);

  // lists by all filters
  const listDocs = await ListModel.find({
    ...queryFilter,
    ...categoryFilter,
    ...priceFilter,
    ...tagFilter,
  })
    .sort(order)
    .skip(pageSize * (listPage - 1))
    .limit(pageSize)
    .lean();

  // only active lists
  const activeListDocs = await ListModel.find({
    ...queryFilter,
    ...categoryFilter,
    ...priceFilter,
    ...tagFilter,
    status: ListStatus.Listing,
  })
    .sort(order)
    .skip(pageSize * (listPage - 1))
    .limit(pageSize)
    .lean();

  let items = listDocs.map(db.convertDocToObj);
  items.forEach(
    (item: { id: string; nftAddress: any; tokenId: any }) =>
      (item.id = `${item.nftAddress}:${item.tokenId}`),
  );

  let activeItems = activeListDocs.map(db.convertDocToObj);
  items.forEach(
    (item: { id: string; nftAddress: any; tokenId: any }) =>
      (item.id = `${item.nftAddress}:${item.tokenId}`),
  );

  // collections by name
  const collectionDocs = await CollectionModel.find({ ...queryFilter })
    .sort(order)
    .skip(pageSize * (collectionPage - 1))
    .limit(pageSize)
    .lean();
  let colls = collectionDocs.map(db.convertDocToObj);

  // users by name
  const userDocs = await UserModel.find({ ...queryFilter })
    .sort(order)
    .skip(pageSize * (userPage - 1))
    .limit(pageSize)
    .lean();
  let users = userDocs.map(db.convertDocToObj);

  // number of list
  const listCount = await ListModel.countDocuments({
    ...queryFilter,
    ...categoryFilter,
    ...priceFilter,
    ...tagFilter,
  });

  // number of active list
  const activeListCount = await ListModel.countDocuments({
    ...queryFilter,
    ...categoryFilter,
    ...priceFilter,
    ...tagFilter,
    status: ListStatus.Listing,
  });

  // number of collection
  const collectionCount = await CollectionModel.countDocuments({
    ...queryFilter,
  });

  // number of users
  const userCount = await UserModel.countDocuments({
    ...queryFilter,
  });

  return {
    props: {
      categories,
      tags,
      items,
      activeItems,
      colls,
      users,
      listCount,
      activeListCount,
      listPage,
      listPages: Math.ceil(listCount / pageSize),
      collectionPage,
      collectionCount,
      collectionPages: Math.ceil(collectionCount / pageSize),
      userPage,
      userCount,
      userPages: Math.ceil(userCount / pageSize),
      tabPage,
    },
  };
};
