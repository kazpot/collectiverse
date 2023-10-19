import { Container } from '@mui/material';
import { GetServerSideProps } from 'next';
import { splitIntoChunks } from '../../../common/util';
import Layout from '../../../components/Layout';
import MintForm from '../../../components/form/MintForm';
import Category from '../../../models/Category';
import Tag from '../../../models/Tag';
import db from '../../../utils/db';
import classes from '../../../utils/classes';
import { CollectionProfile } from '../../../common/types';
import Collection from '../../../models/Collection';

type Props = {
  tagOptions: string[][];
  categoryOptions: string[];
  collections?: CollectionProfile[];
};

const Create = ({ tagOptions, categoryOptions, collections }: Props) => {
  return (
    <Layout>
      <Container maxWidth='xl' sx={classes.main}>
        <MintForm
          tagOptions={tagOptions}
          categoryOptions={categoryOptions}
          collections={collections}
        />
      </Container>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ query }: { query: any }) => {
  const currentUserAddress = query.id;

  await db.connect();
  const tagDoc = await Tag.find();
  const tagOptions = tagDoc.map((tag) => tag.value);

  const categoryDoc = await Category.find();
  const categoryOptions = categoryDoc.map((cat) => cat.value);

  let collections = null;
  const collectionDoc = await Collection.find({ createdBy: currentUserAddress }).lean();
  if (collectionDoc && collectionDoc.length > 0) {
    collections = collectionDoc.map(db.convertDocToObj);
  }

  const splitOptions = splitIntoChunks(tagOptions, 5);
  return { props: { tagOptions: splitOptions, categoryOptions, collections } };
};

export default Create;
