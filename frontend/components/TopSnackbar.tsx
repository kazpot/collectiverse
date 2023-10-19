import { Alert } from '@mui/material';
import Snackbar from '@mui/material/Snackbar';

type Props = {
  text: string;
  open: boolean;
};

export default function TopSnackbar(props: Props) {
  return (
    <div>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={props.open}
        key={'topcenter'}
      >
        <Alert severity='warning'>{props.text}</Alert>
      </Snackbar>
    </div>
  );
}
