import React from 'react';
import { CardMedia } from '@mui/material';

type Props = {
  url: string;
  type: string;
  name: string;
  loading?: boolean;
};

export default function CollectionCardMedia({ url, name, type }: Props) {
  return (
    <div>
      {type.includes('image') && <CardMedia component='img' image={url} title={name} />}
      {type.includes('video') && (
        <CardMedia component='video' image={url} title={name} autoPlay loop muted />
      )}
    </div>
  );
}
