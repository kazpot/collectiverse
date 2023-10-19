import React from 'react';
import Image from 'next/image';

type Props = {
  url?: string;
  type?: string;
  size?: string;
};

export default function NFTImage({ url, type, size }: Props) {
  return (
    <div style={{ margin: '20px' }}>
      {url && type === 'video/mp4' && (
        <video
          width={size ? size : '600px'}
          height={size ? size : '600px'}
          muted
          loop
          autoPlay
          playsInline
        >
          <source src={url} type='video/mp4' />
        </video>
      )}
      {url && type?.includes('image/') && (
        <Image
          src={url}
          height={size ? size : '600px'}
          width={size ? size : '600px'}
          alt='Asset Image'
        />
      )}
      {!url && (
        <Image
          src='/assets/no_image_500.png'
          height={size ? size : '600px'}
          width={size ? size : '600px'}
          alt='No Image'
        />
      )}
    </div>
  );
}
