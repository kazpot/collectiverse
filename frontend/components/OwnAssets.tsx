import { Grid } from '@mui/material';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { openModal } from '../actions/modal.actions';
import { ModalType, UserItem, UserProfile, CollectionProfile } from '../common/types';
import { RootState } from '../store/configureStore';
import ModalDialog from './ModalDaialog';
import NFTOwnedCard from './card/NFTOwnedCard';

type Props = {
  userProfile: UserProfile;
  tagOptions: string[][];
  categoryOptions: string[];
  collections?: CollectionProfile[];
  userItems?: UserItem[];
};

export default function OwnAssets({ tagOptions, categoryOptions, collections, userItems }: Props) {
  const dispatch = useDispatch();

  const currentUserAddress = useSelector((state: RootState) => state.currentUser);
  const { isOpen } = useSelector((state: RootState) => state.modal);

  const [userItem, setUserItem] = useState<UserItem>();

  const openListModal = (item: any) => {
    setUserItem(item);
    dispatch(openModal());
  };

  return (
    <div>
      <Grid container spacing={3}>
        {userItems &&
          userItems.map((userItem) => (
            <Grid item md={4} key={userItem.tokenUri}>
              <NFTOwnedCard
                userItem={userItem}
                currentUserAddress={currentUserAddress}
                openListModal={openListModal}
                listed={userItem.listing}
              />
            </Grid>
          ))}
      </Grid>
      <ModalDialog
        isOpen={isOpen}
        item={userItem as UserItem}
        categoryOptions={categoryOptions}
        tagOptions={tagOptions}
        type={ModalType.List}
        collections={collections}
      />
    </div>
  );
}
