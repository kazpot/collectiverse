import { CircularProgress } from '@mui/material';

export default function ServerSideLoading() {
  return (
    <div
      style={{ zIndex: '10', position: 'fixed', display: 'table', width: '100%', height: '100%' }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          height: '100%',
        }}
      >
        <CircularProgress color='primary' />
      </div>
    </div>
  );
}
