import { Card, CardActionArea, CardContent, Typography, Stack, Divider } from '@mui/material';
import React from 'react';
import NextLink from 'next/link';
import Countdown from 'react-countdown';
import { NFTCollection, TimeRendererProps } from '../../common/types';
import NFTCardMedia from '../NFTCardMedia';
import { chains } from '../../common/const';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/configureStore';

type Props = {
  item: NFTCollection;
};

export default function NFTItemCard({ item }: Props) {
  const chainId: number = parseInt(useSelector((state: RootState) => state.chainId));

  const renderer = ({ days, hours, minutes, seconds, completed }: TimeRendererProps) => {
    if (completed) {
      return <div>Time up</div>;
    } else {
      return (
        <span>
          {days}d {hours}h {minutes}m {seconds}s
        </span>
      );
    }
  };

  return (
    <div>
      <Card sx={{ borderRadius: '20px' }}>
        <NextLink href={`/products/${item.nftAddress}:${item.tokenId}`} passHref>
          <CardActionArea>
            <NFTCardMedia url={item.image} name={item.name} type={item.mimeType} />
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
            spacing={2}
          >
            {item.auction.toString() == 'true' ? (
              <Typography style={{ color: 'white' }}>
                <span style={{ color: 'grey' }}>Current bid</span>
                <br />
                <span style={{ fontWeight: 'bold', fontSize: '15px' }}>
                  {!item.bestPrice ? item.price : item.bestPrice}{' '}
                  {chains[chainId] && chains[chainId].auctionSymbol}
                </span>
              </Typography>
            ) : (
              <Typography style={{ color: 'white' }}>
                <span style={{ color: 'grey' }}>Fixed price</span>
                <br />
                <span style={{ fontWeight: 'bold', fontSize: '18px' }}>
                  {item.price} {chains[chainId] && chains[chainId].nativeSymbol}
                </span>
              </Typography>
            )}

            {item.auction.toString() == 'true' && (
              <Typography style={{ color: 'white' }}>
                <span style={{ color: 'grey' }}>Ends in</span>
                <br />
                <span style={{ fontWeight: 'bold', fontSize: '18px' }}>
                  <Countdown date={parseInt(item.expirationTime) * 1000} renderer={renderer} />
                </span>
              </Typography>
            )}
          </Stack>
        </CardContent>
      </Card>
    </div>
  );
}
