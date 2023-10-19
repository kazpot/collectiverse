import { CircularProgress, Grid } from '@mui/material';

export default function ImageLoading() {
  return (
    <Grid
      container
      spacing={0}
      direction='column'
      alignItems='center'
      justifyContent='center'
      style={{ minHeight: '100vh' }}
    >
      <Grid item xs={3}>
        <CircularProgress color='inherit' />
      </Grid>
    </Grid>
  );
}
