import React from 'react';
import {
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Button,
  Stack,
  Divider,
} from '@mui/material';
import Countdown from 'react-countdown';
import NextLink from 'next/link';
import NFTCardMedia from '../NFTCardMedia';
import { NFTCollection, TimeRendererProps } from '../../common/types';
import { chains, nariveSymbol } from '../../common/const';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/configureStore';

type Props = {
  item: NFTCollection;
  currentUserAddress: string;
  // eslint-disable-next-line no-unused-vars
  accept: (item: NFTCollection) => void;
  // eslint-disable-next-line no-unused-vars
  cancel: (item: NFTCollection) => void;
  loading: boolean;
};

export default function NFTCreatedCard({
  item,
  currentUserAddress,
  accept,
  cancel,
  loading,
}: Props) {
  const chainId: number = parseInt(useSelector((state: RootState) => state.chainId));

  const renderer = ({ days, hours, minutes, seconds, completed }: TimeRendererProps) => {
    if (completed) {
      return <div>Time up</div>;
    } else {
      return (
        <span>
          {days} days {hours} hr {minutes} min {seconds} sec
        </span>
      );
    }
  };

  return (
    <div>
      <Card sx={{ borderRadius: '20px' }}>
        <NextLink href={`/products/${item.nftAddress}:${item.tokenId}`} passHref>
          <CardActionArea>
            <NFTCardMedia
              url={item.image}
              name={item.name}
              type={item.mimeType}
              loading={loading}
            />
          </CardActionArea>
        </NextLink>
        <CardContent sx={{ backgroundColor: 'white' }}>
          <Typography variant='h5' style={{ fontWeight: 'bold' }}>
            {item.name}
          </Typography>
        </CardContent>
        <CardContent sx={{ backgroundColor: '#132c6f' }}>
          <Stack
            direction='row'
            divider={<Divider orientation='vertical' flexItem sx={{ borderColor: 'white' }} />}
            spacing={1.5}
          >
            {item.auction.toString() == 'true' ? (
              <Typography style={{ color: 'white' }}>
                <span style={{ color: 'grey' }}>Current bid</span>
                <br />
                <span style={{ fontWeight: 'bold', fontSize: '14px' }}>
                  {!item.bestPrice ? item.price : item.bestPrice}{' '}
                  {chains[chainId] && chains[chainId].auctionSymbol}
                </span>
              </Typography>
            ) : (
              <Typography style={{ color: 'white' }}>
                <span style={{ color: 'grey' }}>Fixed price</span>
                <br />
                <span style={{ fontWeight: 'bold', fontSize: '14px' }}>
                  {item.price} {chains[chainId] ? chains[chainId].nativeSymbol : nariveSymbol}
                </span>
              </Typography>
            )}

            {item.auction.toString() == 'true' && (
              <Typography style={{ color: 'white' }}>
                <span style={{ color: 'grey' }}>Ends in</span>
                <br />
                <span style={{ fontWeight: 'bold', fontSize: '14px' }}>
                  <Countdown date={parseInt(item.expirationTime) * 1000} renderer={renderer} />
                </span>
              </Typography>
            )}
          </Stack>
        </CardContent>
        <CardContent sx={{ justifyContent: 'center', display: 'flex' }}>
          {currentUserAddress.toLowerCase() === item.maker.toLowerCase() && (
            <Button
              disabled={parseInt(item.expirationTime) * 1000 > Date.now() || item.bestPrice == ''}
              onClick={() => cancel(item)}
              variant='outlined'
              sx={{
                backgroundColor: 'white',
                color: 'black',
                width: '180px',
                fontSize: '20px',
                margin: '8px',
                borderColor: 'black',
                '&:hover': {
                  background: '#fcfcfc',
                },
              }}
            >
              Cancel
            </Button>
          )}
          {item.auction.toString() == 'true' &&
            currentUserAddress.toLowerCase() === item.maker.toLowerCase() && (
              <Button
                disabled={parseInt(item.expirationTime) * 1000 > Date.now() || item.bestPrice == ''}
                onClick={() => accept(item)}
                variant='outlined'
                sx={{
                  backgroundColor: '#AB892F',
                  color: 'white',
                  width: '180px',
                  fontSize: '20px',
                  margin: '8px',
                  '&:hover': {
                    background: '#bf9934',
                  },
                }}
              >
                Accept
              </Button>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
