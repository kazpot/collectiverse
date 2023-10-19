import React from 'react';
import { Card, CardActionArea, Avatar } from '@mui/material';
import NextLink from 'next/link';
import CollectionCardMedia from '../CollectionCardMedia';
import { CollectionProfile, UserProfile } from '../../common/types';
import Image from 'next/image';

type Props = {
  collection: CollectionProfile;
  userProfile?: UserProfile;
};

export default function CollectionCard({ collection, userProfile }: Props) {
  return (
    <div>
      <Card sx={{ borderRadius: '20px' }}>
        <NextLink href={`/collection/${collection.collectionId}`} passHref>
          <CardActionArea>
            <CollectionCardMedia
              url={collection.cardImage}
              name={collection.collectionId}
              type='image/jpeg'
            />
            <div
              style={{
                position: 'absolute',
                color: 'white',
                fontSize: '40px',
                fontWeight: 'bold',
                top: '65%',
                left: '10%',
              }}
            >
              {collection.name}
            </div>
            {userProfile && (
              <NextLink href={`/about/${userProfile.address}`} passHref>
                <div
                  style={{
                    position: 'absolute',
                    color: 'white',
                    fontSize: '20px',
                    fontWeight: 'bold',
                    top: '80%',
                    left: '10%',
                    backgroundColor: 'rgba(123,123,123,.5)',
                    width: '22vw',
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
                    {userProfile.profileImage && (
                      <Image
                        src={userProfile.profileImage}
                        height='40px'
                        width='40px'
                        alt='Profile Image'
                      />
                    )}
                  </Avatar>
                  @{userProfile.name}
                </div>
              </NextLink>
            )}
          </CardActionArea>
        </NextLink>
      </Card>
    </div>
  );
}
