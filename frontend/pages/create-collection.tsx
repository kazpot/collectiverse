import Layout from '../components/Layout';
import CreateCollectionForm from '../components/form/CeateCollectionForm';
import { Container } from '@mui/material';
import classes from '../utils/classes';
import { GetServerSideProps } from 'next';
import db from '../utils/db';
import Collection from '../models/Collection';

type Props = {
  collNames: string[];
  collIds: string[];
};

const CreateCollection = ({ collNames, collIds }: Props) => {
  return (
    <Layout>
      <Container maxWidth='xl' sx={classes.main}>
        <h1>Create Collection</h1>
        <CreateCollectionForm collNames={collNames} collIds={collIds} />
      </Container>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  await db.connect();
  const collDoc = await Collection.find({}, { name: 1, collectionId: 1, _id: 0 });
  const collNames = collDoc.map((coll) => coll.name);
  const collIds = collDoc.map((coll) => coll.collectionId);
  return { props: { collNames, collIds } };
};

export default CreateCollection;
