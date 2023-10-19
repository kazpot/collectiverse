import { Grid } from '@mui/material';
import React from 'react';
import { CollectionProfile, UserProfile } from '../common/types';
import CollectionCard from './card/CollectionCard';

type Props = {
  collections: CollectionProfile[];
  userProfile: UserProfile;
};

export default function CollectionBoard({ collections, userProfile }: Props) {
  return (
    <div>
      <Grid container spacing={3}>
        {collections &&
          collections.length > 0 &&
          collections.map((coll) => (
            <Grid item md={4} key={coll.collectionId}>
              <CollectionCard collection={coll} userProfile={userProfile} />
            </Grid>
          ))}
      </Grid>
    </div>
  );
}
