import { FollowedUsers, FollowingUsers, UserProfile } from '../common/types';
import axios from 'axios';
import { getCurrentUser } from '../common/util';

const apiServerUri = process.env.NEXT_PUBLIC_API_SERVER_URI || '';

export const signUp = async (userAddr: string): Promise<boolean> => {
  try {
    const currentUser = await getCurrentUser();
    const sig = await currentUser.signMessage(userAddr);
    const res = await axios.post('/api/users/', { address: userAddr, sig });
    if (res.status !== 200) {
      return false;
    }
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
};

export const isUser = async (userAddress: string): Promise<boolean> => {
  try {
    const userProfile = await getUserProfile(userAddress);
    if (!userProfile) {
      return false;
    }
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
};

export const editUserProfile = async (userProfile: UserProfile): Promise<boolean> => {
  try {
    const currentUser = await getCurrentUser();
    const sig = await currentUser.signMessage(userProfile.address);
    const res = await axios.post(`${apiServerUri}/api/users/edit`, { userProfile, sig });
    if (res.status !== 200) {
      return false;
    }
  } catch (e) {
    console.error(e);
    return false;
  }
  return true;
};

export const getUserProfile = async (address: string): Promise<UserProfile | null> => {
  if (!address || address.length !== 42) {
    return null;
  }
  let userProfile: UserProfile = {
    name: '',
    username: '',
    email: '',
    bio: '',
    profileImage: '',
    coverImage: '',
    webSite: '',
    discord: '',
    twitter: '',
    instagram: '',
    address: '',
    createdAt: '',
  };
  try {
    const res = await axios.get(`${apiServerUri}/api/users/${address}`);
    userProfile = res.data;
  } catch (e) {
    console.error(e);
    return null;
  }
  return userProfile;
};

export const followUser = async (username: string): Promise<boolean> => {
  try {
    const signer = await getCurrentUser();
    const currentUserAddress = await signer.getAddress();
    const sig = await signer.signMessage(currentUserAddress);
    const res = await axios.post(`${apiServerUri}/api/follow`, {
      username,
      follower: currentUserAddress,
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

export const unfollowUser = async (username: string): Promise<boolean> => {
  try {
    const signer = await getCurrentUser();
    const currentUserAddress = await signer.getAddress();
    const sig = await signer.signMessage(currentUserAddress);
    const res = await axios.post(`${apiServerUri}/api/unfollow`, {
      username,
      follower: currentUserAddress,
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

export const checkFollowerExists = async (username: string): Promise<boolean> => {
  try {
    const signer = await getCurrentUser();
    const currentUserAddress = await signer.getAddress();
    const res = await axios.post(`${apiServerUri}/api/follow/check`, {
      username,
      follower: currentUserAddress,
    });
    if (res.status !== 200) {
      return false;
    }
    return res.data;
  } catch (e) {
    console.error(e);
  }
  return false;
};

export const getFollowedFollowing = async (
  username: string,
): Promise<{ followedUsers: FollowedUsers[]; followingUsers: FollowingUsers[] }> => {
  try {
    const res = await axios.post(`${apiServerUri}/api/follow/get`, {
      username,
    });
    if (res.status !== 200) {
      return { followedUsers: [], followingUsers: [] };
    }
    const { followed, following }: { followed: FollowedUsers[]; following: FollowingUsers[] } =
      res.data;
    return { followedUsers: followed, followingUsers: following };
  } catch (e) {
    console.error(e);
  }
  return { followedUsers: [], followingUsers: [] };
};
