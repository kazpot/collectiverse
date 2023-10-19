import React from 'react';
import { Card, CardActionArea, Avatar } from '@mui/material';
import NextLink from 'next/link';
import NFTCardMedia from '../NFTCardMedia';
import { UserProfile } from '../../common/types';
import Image from 'next/image';

type Props = {
  user: UserProfile;
};

export default function UserCard({ user }: Props) {
  return (
    <div>
      <Card sx={{ borderRadius: '20px', width: '300px' }}>
        <NextLink href={`/about/${user.address}`} passHref>
          <CardActionArea>
            {user.profileImage ? (
              <NFTCardMedia url={user.profileImage} name={user.username} type='image/jpeg' />
            ) : (
              <NFTCardMedia url='/assets/profile.png' name={user.username} type='image/jpeg' />
            )}
            <NextLink href={`/about/${user.address}`} passHref>
              <div
                style={{
                  position: 'absolute',
                  color: 'white',
                  fontSize: '20px',
                  fontWeight: 'bold',
                  top: '70%',
                  left: '10%',
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
                  {user.profileImage && (
                    <Image src={user.profileImage} height='40px' width='40px' alt='Profile Image' />
                  )}
                </Avatar>
                @{user.name}
              </div>
            </NextLink>
          </CardActionArea>
        </NextLink>
      </Card>
    </div>
  );
}
