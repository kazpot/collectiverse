import {
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Stepper,
  Step,
  StepLabel,
  Box,
} from '@mui/material';
import React from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { closeModal } from '../actions/modal.actions';
import { useDispatch } from 'react-redux';

type Props = {
  title: string;
  text: string;
  activeStep: number;
};

const steps = ['Start', 'Mint', 'List'];

export default function ModalMessage({ title, text, activeStep }: Props) {
  const dispatch = useDispatch();

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
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>
        <DialogContentText>{text}</DialogContentText>
      </DialogContent>
    </div>
  );
}
