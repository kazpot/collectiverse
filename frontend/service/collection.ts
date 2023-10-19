import { CollectionProfile } from '../common/types';
import axios from 'axios';
import { getCurrentUser } from '../common/util';

const apiServerUri = process.env.NEXT_PUBLIC_API_SERVER_URI || '';

export const createCollectionProfile = async (collProfile: CollectionProfile): Promise<boolean> => {
  try {
    const currentUser = await getCurrentUser();
    const sig = await currentUser.signMessage(collProfile.createdBy);
    const res = await axios.post(`${apiServerUri}/api/collections/`, { collProfile, sig });
    if (res.status !== 200) {
      return false;
    }
  } catch (e) {
    console.error(e);
    return false;
  }
  return true;
};

export const editCollectionProfile = async (collProfile: CollectionProfile): Promise<boolean> => {
  try {
    const currentUser = await getCurrentUser();
    const sig = await currentUser.signMessage(collProfile.createdBy);
    const res = await axios.post(`${apiServerUri}/api/collections/edit`, { collProfile, sig });
    if (res.status !== 200) {
      return false;
    }
  } catch (e) {
    console.error(e);
    return false;
  }
  return true;
};

export const deleteCollectionProfile = async (collProfile: CollectionProfile): Promise<boolean> => {
  try {
    const currentUser = await getCurrentUser();
    const sig = await currentUser.signMessage(collProfile.createdBy);
    const res = await axios.post(`${apiServerUri}/api/collections/delete`, { collProfile, sig });
    if (res.status !== 200) {
      return false;
    }
  } catch (e) {
    console.error(e);
    return false;
  }
  return true;
};

export const getCollectionProfile = async (
  collectionId: string,
): Promise<CollectionProfile | null> => {
  if (!collectionId) {
    return null;
  }
  let collProfile: CollectionProfile = {
    name: '',
    collectionId: '',
    description: '',
    coverImage: '',
    webSite: '',
    discord: '',
    twitter: '',
    instagram: '',
    createdBy: '',
    cardImage: '',
    user: [],
    items: [],
  };
  try {
    const res = await axios.get(`${apiServerUri}/api/collections/${collectionId}`);
    collProfile = res.data;
  } catch (e) {
    console.error(e);
  }
  return collProfile;
};

export const addItem = async (listId: string, collectionId: string): Promise<boolean> => {
  try {
    const currentUser = await getCurrentUser();
    const userAddress = await currentUser.getAddress();
    const sig = await currentUser.signMessage(userAddress);
    const res = await axios.post(`${apiServerUri}/api/collections/add-item`, {
      listId,
      collectionId,
      userAddress,
      sig,
    });
    if (res.status !== 200) {
      return false;
    }
  } catch (e) {
    console.error(e);
    return false;
  }
  return true;
};
