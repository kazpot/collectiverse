import React from 'react';
import { Button } from '@mui/material';
import { NFTCollection, TimeRendererProps } from '../common/types';
import NFTImage from '../components/NFTImage';
import Countdown from 'react-countdown';
import NextLink from 'next/link';
import { chains, nariveSymbol } from '../common/const';
import { useSelector } from 'react-redux';
import { RootState } from '../store/configureStore';
import json2mq from 'json2mq';
import useMediaQuery from '@mui/material/useMediaQuery';

type Props = {
  item: NFTCollection;
};

export default function FeaturedImage({ item }: Props) {
  const chainId: number = parseInt(useSelector((state: RootState) => state.chainId));

  const matches = useMediaQuery(
    json2mq({
      minWidth: 1200,
    }),
  );

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
      {item && matches && (
        <div>
          <div
            style={{
              backgroundImage: `url(${item.image})`,
              filter: 'blur(32px)',
              height: '700px',
              marginTop: '50px',
              marginBottom: '50px',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
            }}
          ></div>
          <div
            style={{
              backgroundColor: 'rgba(0,0,0, 0)',
              position: 'absolute',
              left: '10%',
              top: '100px',
              color: 'white',
              fontSize: '40px',
            }}
          >
            <h1>{item.name}</h1>
          </div>
          <div
            style={{
              backgroundColor: 'rgba(0,0,0, 0)',
              position: 'absolute',
              left: '10%',
              top: '270px',
              color: '#D3D3D3',
              fontSize: '23px',
            }}
          >
            Cateogry: {item.category}
          </div>
          <div
            style={{
              backgroundColor: 'rgba(0,0,0,0)',
              position: 'absolute',
              left: '10%',
              top: '310px',
              color: 'white',
              fontSize: '17px',
              width: '500px',
            }}
          >
            {item.desc}
          </div>
          <div style={{ position: 'absolute', left: '10%', top: '520px' }}>
            {item.tags.map(
              (tag) =>
                tag !== '' && (
                  <Button key={tag} size='small' variant='outlined' sx={{ margin: '10px' }}>
                    {tag}
                  </Button>
                ),
            )}
          </div>
          {item.auction.toString() == 'true' ? (
            <div>
              <div
                style={{
                  backgroundColor: 'rgba(0,0,0, 0)',
                  position: 'absolute',
                  left: '10%',
                  top: '580px',
                  color: '#D3D3D3',
                  fontSize: '20px',
                }}
              >
                Current bid
              </div>
              <div
                style={{
                  backgroundColor: 'rgba(0,0,0, 0)',
                  position: 'absolute',
                  left: '10%',
                  top: '610px',
                  color: 'white',
                  fontSize: '30px',
                  fontWeight: 'bold',
                }}
              >
                {!item.bestPrice ? item.price : item.bestPrice}{' '}
                {chains[chainId] && chains[chainId].auctionSymbol}
              </div>
              <div
                style={{
                  backgroundColor: 'rgba(0,0,0, 0)',
                  position: 'absolute',
                  left: '25%',
                  top: '580px',
                  color: '#D3D3D3',
                  fontSize: '20px',
                }}
              >
                Ends in
              </div>
              <div
                style={{
                  backgroundColor: 'rgba(0,0,0, 0)',
                  position: 'absolute',
                  left: '25%',
                  top: '610px',
                  color: 'white',
                  fontSize: '30px',
                  fontWeight: 'bold',
                }}
              >
                <Countdown date={parseInt(item.expirationTime) * 1000} renderer={renderer} />
              </div>
            </div>
          ) : (
            <div>
              <div
                style={{
                  backgroundColor: 'rgba(0,0,0, 0)',
                  position: 'absolute',
                  left: '10%',
                  top: '580px',
                  color: '#D3D3D3',
                  fontSize: '20px',
                }}
              >
                Fixed Price
              </div>
              <div
                style={{
                  backgroundColor: 'rgba(0,0,0, 0)',
                  position: 'absolute',
                  left: '10%',
                  top: '610px',
                  color: 'white',
                  fontSize: '30px',
                  fontWeight: 'bold',
                }}
              >
                {item.price} {chains[chainId] ? chains[chainId].nativeSymbol : nariveSymbol}
              </div>
            </div>
          )}

          <div style={{ position: 'absolute', left: '10%', top: '670px' }}>
            <NextLink href={`/products/${item.nftAddress}:${item.tokenId}`} passHref>
              <Button
                key='viewnft'
                variant='contained'
                sx={{
                  margin: '10px',
                  backgroundColor: '#AB892F',
                  borderRadius: '35px',
                  fontSize: '22px',
                  fontWeight: 'bold',
                  padding: '15px',
                  width: '300px',
                  color: 'white',
                }}
              >
                View NFT
              </Button>
            </NextLink>
          </div>
          <div
            style={{
              backgroundColor: 'rgba(0,0,0, 0)',
              position: 'absolute',
              left: '55%',
              top: '150px',
              minWidth: '600px',
            }}
          >
            <NFTImage url={item.image} type={item.mimeType} />
          </div>
        </div>
      )}
    </div>
  );
}
