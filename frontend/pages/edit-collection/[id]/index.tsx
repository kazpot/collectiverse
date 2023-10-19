import Layout from '../../../components/Layout';
import classes from '../../../utils/classes';
import { Container } from '@mui/material';
import { GetServerSideProps } from 'next';
import React from 'react';
import db from '../../../utils/db';
import Collection from '../../../models/Collection';
import { CollectionProfile } from '../../../common/types';
import EditCollectionForm from '../../../components/form/EditCollectionForm';

type Props = {
  collection: CollectionProfile;
};

const EditCollection = ({ collection }: Props) => {
  return (
    <Layout>
      <Container maxWidth='xl' sx={classes.main}>
        <h1>Edit Your Collection</h1>
        <EditCollectionForm collection={collection} />
      </Container>
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
    { $unwind: '$items' },
    {
      $lookup: {
        from: 'lists',
        localField: 'items',
        foreignField: 'listId',
        as: 'items',
      },
    },
  ]);
  const colls = collections.map((coll) => {
    let collObj = db.convertDocToObj(coll);
    const users = collObj.user.map(db.convertDocToObj);
    collObj.user = users;
    const items = collObj.items.map(db.convertDocToObj);
    collObj.items = items;
    return collObj;
  });

  return { props: { collection: colls[0] } };
};

export default EditCollection;
