import { Container, Grid } from '@mui/material';
import Layout from '../components/Layout';
import { CollectionProfile, NFTCollection, ListStatus } from '../common/types';
import { GetServerSideProps } from 'next';
import NFTItemCard from '../components/card/NFTItemCard';
import classes from '../utils/classes';
import FeaturedImage from '../components/FeaturedImage';
import db from '../utils/db';
import Collection from '../models/Collection';
import List from '../models/List';
import CollectionCard from '../components/card/CollectionCard';

type Props = {
  items: NFTCollection[];
  collections: CollectionProfile[];
};

const Home = ({ items, collections }: Props) => {
  return (
    <Layout>
      <FeaturedImage item={items[0]} />
      <Container maxWidth='xl' sx={classes.main}>
        <h1>New Arrivals</h1>
        <Grid container spacing={3}>
          {items.length > 0 &&
            items.map((item) => (
              <Grid item md={3} xs={6} key={item.listingTime}>
                <NFTItemCard item={item} />
              </Grid>
            ))}
        </Grid>
        <h1>New Collections</h1>
        <Grid container spacing={3}>
          {collections &&
            collections.length > 0 &&
            collections.map((collection) => (
              <Grid item md={4} xs={6} key={collection.collectionId}>
                <CollectionCard collection={collection} userProfile={collection.user[0]} />
              </Grid>
            ))}
        </Grid>
      </Container>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  await db.connect();

  let items = await List.find({ status: ListStatus.Listing })
    .sort({ createdAt: -1 })
    .limit(20)
    .lean();
  items = items.map(db.convertDocToObj);

  let collections = await Collection.aggregate([
    {
      $limit: 20,
    },
    { $sort: { createdAt: -1 } },
    {
      $lookup: {
        from: 'users',
        localField: 'createdBy',
        foreignField: 'address',
        as: 'user',
      },
    },
  ]);

  collections = collections.map((coll) => {
    let collObj = db.convertDocToObj(coll);
    const users = collObj.user.map(db.convertDocToObj);
    collObj.user = users;
    return collObj;
  });

  return { props: { items, collections } };
};

export default Home;
