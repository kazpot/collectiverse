import { DialogContent, DialogTitle, IconButton, Box, Alert, Button } from '@mui/material';
import React from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { closeModal } from '../actions/modal.actions';
import { useDispatch } from 'react-redux';
import { deleteCollectionProfile } from '../service/collection';
import { CollectionProfile } from '../common/types';
import { useRouter } from 'next/router';

type Props = {
  title: string;
  text: string;
  collection?: CollectionProfile;
};

export default function ModalYesOrNo({ title, text, collection }: Props) {
  const dispatch = useDispatch();
  const router = useRouter();

  const yesHandler = async () => {
    if (collection) {
      await deleteCollectionProfile(collection);
      router.push(`/about/${collection.createdBy}`);
    }
    dispatch(closeModal());
  };

  const noHandler = async () => {
    dispatch(closeModal());
  };

  return (
    <div>
      <DialogTitle>
        {title}
        <IconButton
          aria-label='close'
          onClick={() => dispatch(closeModal())}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ width: '100%' }}>
          <Alert severity='warning'>{text}</Alert>
          <Button
            variant='outlined'
            sx={{ border: '1px solid', borderRadius: '10px', margin: '10px', color: 'blue' }}
            onClick={yesHandler}
          >
            Yes
          </Button>
          <Button
            variant='outlined'
            sx={{ border: '1px solid', borderRadius: '10px', margin: '10px', color: 'red' }}
            onClick={noHandler}
          >
            No
          </Button>
        </Box>
      </DialogContent>
    </div>
  );
}
