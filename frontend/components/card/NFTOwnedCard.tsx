import React from 'react';
import NFTCardMedia from '../NFTCardMedia';
import { Button, Card, CardContent, Typography } from '@mui/material';

type Props = {
  userItem: any;
  currentUserAddress: string;
  // eslint-disable-next-line no-unused-vars
  openListModal: (item: any) => void;
  listed: boolean;
};

export default function NFTOwnedCard({
  userItem,
  currentUserAddress,
  openListModal,
  listed,
}: Props) {
  return (
    <div>
      <Card sx={{ borderRadius: '20px' }}>
        <NFTCardMedia url={userItem.image} name={userItem.name} type={userItem.mimeType} />
        <CardContent sx={{ backgroundColor: 'white' }}>
          <Typography variant='h5' style={{ fontWeight: 'bold' }}>
            {userItem.name}
          </Typography>
        </CardContent>
        <CardContent sx={{ backgroundColor: '#132c6f' }}>
          <Typography sx={{ color: 'white', fontWeight: 'bold' }}>
            {listed ? 'Listed: Yes' : 'List: No'}
          </Typography>
        </CardContent>
        <CardContent>
          {currentUserAddress.toLowerCase() === userItem.maker.toLowerCase() && (
            <Button
              disabled={listed}
              onClick={() => openListModal(userItem)}
              variant='outlined'
              sx={{
                backgroundColor: 'white',
                color: 'black',
                width: '100px',
                fontSize: '15px',
                margin: '8px',
                borderColor: 'black',
                '&:hover': {
                  background: '#fcfcfc',
                },
              }}
            >
              List
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
