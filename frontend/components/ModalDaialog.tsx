import { Dialog } from '@mui/material';
import React from 'react';
import { useDispatch } from 'react-redux';
import { closeModal } from '../actions/modal.actions';
import { BidOrder, ModalType, NFTCollection, UserItem, CollectionProfile } from '../common/types';
import AcceptForm from './form/AcceptForm';
import ListForm from './form/ListForm';
import BidForm from './form/BidForm';
import ModalMessage from './ModalMessage';
import ModalYesOrNo from './ModalYesOrNo';

type ModalProps = {
  isOpen: boolean;
  item?: UserItem | NFTCollection;
  bestBid?: string;
  bestBidOrder?: BidOrder;
  type: ModalType;
  categoryOptions?: string[];
  tagOptions?: string[][];
  collections?: CollectionProfile[];
  activeStep?: number;
  collection?: CollectionProfile;
};

export default function ModalDialog({
  isOpen,
  item,
  type,
  bestBid,
  bestBidOrder,
  categoryOptions,
  tagOptions,
  collections,
  activeStep,
  collection,
}: ModalProps) {
  const dispatch = useDispatch();

  const handleClose = (event: any, reason: any) => {
    if (reason !== 'backdropClick') {
      dispatch(closeModal());
    }
  };

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      {
        {
          0: bestBid && <BidForm item={item as NFTCollection} bestBid={bestBid} />,
          1: (
            <ListForm
              userItem={item as UserItem}
              categoryOptions={categoryOptions ? categoryOptions : []}
              tagOptions={tagOptions ? tagOptions : [['']]}
              collections={collections ? collections : []}
            />
          ),
          2: bestBidOrder && (
            <AcceptForm item={item as NFTCollection} bestBidOrder={bestBidOrder} />
          ),
          3: (
            <ModalMessage
              title='Mint & List'
              text='You are minting and listing NFT item. Please check and proceed with metamask.'
              activeStep={activeStep ? activeStep : 0}
            />
          ),
          4: (
            <ModalYesOrNo
              title='Delete collection?'
              text='Once you delete collection, collection can never be recoverd.'
              collection={collection}
            />
          ),
        }[type]
      }
    </Dialog>
  );
}
