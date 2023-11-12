import React, { useEffect, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Divider,
  Grid,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material';
import { AvatarGroup } from '@mui/material';
import { RootState } from '../store/configureStore';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { FollowedUsers, FollowingUsers, UserProfile } from '../common/types';
import Image from 'next/image';
import { convertTimestamp } from '../common/date';
import Gradient from 'rgt';
import TwitterSmallIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import {
  checkFollowerExists,
  getFollowedFollowing,
  followUser,
  unfollowUser,
} from '../service/user';
import { useSnackbar } from 'notistack';
import { TwitterShareButton, TwitterIcon } from 'react-share';
import classes from '../utils/classes';
import NextLink from 'next/link';

type Props = {
  userProfile: UserProfile;
};

export default function Profile({ userProfile }: Props) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const currentUserAddress = useSelector((state: RootState) => state.currentUser);

  const [alreadyFollowed, setAlreadyFollowed] = useState(false);
  const [followed, setFollowed] = useState<FollowedUsers[]>([]);
  const [following, setFollowing] = useState<FollowingUsers[]>([]);

  useEffect(() => {
    async function init() {
      let profileAddress;
      if (userProfile != null) {
        profileAddress = userProfile.address;
      } else {
        profileAddress = currentUserAddress;
      }
      const exists = await checkFollowerExists(profileAddress);
      if (exists) {
        setAlreadyFollowed(true);
      }
      const { followedUsers, followingUsers } = await getFollowedFollowing(profileAddress);
      setFollowed(followedUsers);
      setFollowing(followingUsers);
    }
    init();
  }, [alreadyFollowed, currentUserAddress, userProfile]);

  const editProfileHandler = () => {
    router.push('/editprofile');
  };

  const followHandler = async () => {
    const res = await followUser(userProfile.address);
    if (res) {
      setAlreadyFollowed(true);
      enqueueSnackbar('Followed!', { variant: 'success' });
    } else {
      enqueueSnackbar('Failed to follow!', { variant: 'error' });
    }
  };

  const unfollowHandler = async () => {
    const res = await unfollowUser(userProfile.address);
    if (res) {
      setAlreadyFollowed(false);
      enqueueSnackbar('Unfollowed!', { variant: 'success' });
    } else {
      enqueueSnackbar('Failed to unfollow!', { variant: 'error' });
    }
  };

  return (
    <div style={{ marginLeft: '20px' }}>
      <Box sx={classes.fullWidth}>
        <Avatar
          style={{
            marginLeft: '5px',
            height: '150px',
            width: '150px',
            position: 'absolute',
            zIndex: '10',
            top: '330px',
            bottom: '0',
            left: '30px',
            right: '0',
            border: '5px solid lightgrey',
          }}
        >
          {userProfile.profileImage && (
            <Image src={userProfile.profileImage} height='500' width='500' alt='Profile Image' />
          )}
        </Avatar>
        <ListItem style={{ marginTop: '60px' }}>
          <Gradient dir='left-to-right' from='#00DFD8' to='#007CF0'>
            <Typography style={{ fontSize: '50px', fontWeight: 'bold' }}>
              {userProfile.name ? userProfile.name : ''}
            </Typography>
          </Gradient>
        </ListItem>
        <ListItem style={{ marginTop: '5px' }}>
          <Gradient dir='left-to-right' from='#00DFD8' to='#007CF0'>
            <Typography style={{ fontSize: '25px' }}>
              {userProfile.username ? userProfile.username.substring(0, 20) : ''}
            </Typography>
          </Gradient>
        </ListItem>
        <ListItem>
          {userProfile.webSite && (
            <Grid container direction='row' alignItems='center' spacing={1}>
              <Grid item>web:</Grid>
              <Grid item>
                <a target='_blank' href={userProfile.webSite} rel='noopener noreferrer'>
                  {userProfile.webSite}
                </a>
              </Grid>
            </Grid>
          )}
        </ListItem>
        <ListItem>
          {userProfile.twitter && (
            <Grid container direction='row' alignItems='center' spacing={1}>
              <Grid item>
                <TwitterSmallIcon />
              </Grid>
              <Grid item>
                <a
                  target='_blank'
                  href={`https://twitter.com/${userProfile.twitter}`}
                  rel='noopener noreferrer'
                >
                  {'@' + userProfile.twitter}
                </a>
              </Grid>
            </Grid>
          )}
        </ListItem>
        <ListItem>
          {userProfile.instagram && (
            <Grid container direction='row' alignItems='center' spacing={1}>
              <Grid item>
                <InstagramIcon />
              </Grid>
              <Grid item>
                <a
                  target='_blank'
                  href={`https://www.instagram.com/${userProfile.instagram}`}
                  rel='noopener noreferrer'
                >
                  {'@' + userProfile.instagram}
                </a>
              </Grid>
            </Grid>
          )}
        </ListItem>
        <ListItem>
          {userProfile.discord && (
            <Grid container direction='row' alignItems='center' spacing={1}>
              <Grid item>discord:</Grid>
              <Grid item>
                <a
                  target='_blank'
                  href={`https://discordapp.com/users/${userProfile.discord}`}
                  rel='noopener noreferrer'
                >
                  {'#' + userProfile.discord}
                </a>
              </Grid>
            </Grid>
          )}
        </ListItem>
        <ListItem>
          {currentUserAddress.toLowerCase() === userProfile.address.toLowerCase() && (
            <Button
              style={{ margin: '5px' }}
              sx={{
                backgroundColor: 'white',
                color: 'black',
                width: '100px',
                fontSize: '15px',
                margin: '8px',
                borderColor: 'black',
                '&:hover': {
                  background: '#fcfcfc',
                },
              }}
              variant='outlined'
              onClick={editProfileHandler}
            >
              Edit
            </Button>
          )}
          {currentUserAddress !== userProfile.address && !alreadyFollowed && (
            <Button
              style={{ margin: '5px' }}
              sx={{
                backgroundColor: 'white',
                color: 'black',
                width: '100px',
                fontSize: '15px',
                margin: '8px',
                borderColor: 'black',
                '&:hover': {
                  background: '#fcfcfc',
                },
              }}
              variant='outlined'
              onClick={followHandler}
            >
              Follow
            </Button>
          )}
          {currentUserAddress !== userProfile.address && alreadyFollowed && (
            <Button
              style={{ margin: '5px' }}
              sx={{
                backgroundColor: 'white',
                color: 'black',
                width: '100px',
                fontSize: '15px',
                margin: '8px',
                borderColor: 'black',
                '&:hover': {
                  background: '#fcfcfc',
                },
              }}
              variant='outlined'
              onClick={unfollowHandler}
            >
              Unfollow
            </Button>
          )}
        </ListItem>
        <ListItem>
          <ListItemText>{following.length} following</ListItemText>
          <ListItemText>{followed.length} follower</ListItemText>
        </ListItem>
        <ListItem>
          <Typography variant='h6'>Followed By</Typography>
        </ListItem>
        <ListItem>
          {followed && followed.length > 0 && (
            <AvatarGroup total={followed.length}>
              {followed.map((f) =>
                f.user[0].profileImage ? (
                  <NextLink href={`/about/${f.user[0].address}`} passHref>
                    <Avatar key={f.user[0].profileImage}>
                      <Image
                        src={f.user[0].profileImage}
                        height='500'
                        width='500'
                        alt='Profile Image'
                      />
                    </Avatar>
                  </NextLink>
                ) : (
                  <Avatar />
                ),
              )}
            </AvatarGroup>
          )}
        </ListItem>
        <ListItem>
          <Typography variant='h6'>Bio</Typography>
        </ListItem>
        <Divider />
        <ListItem>{userProfile.bio ? userProfile.bio : ''}</ListItem>
        <Divider />
        <ListItem>
          <Typography variant='h6'>Joined</Typography>
          <Typography sx={classes.ml7} variant='subtitle1'>
            {userProfile.createdAt ? convertTimestamp(userProfile.createdAt) : ''}
          </Typography>
        </ListItem>
        <Divider />
        <TwitterShareButton
          url={`https://collectiverse.com${router.pathname.replace('[id]', currentUserAddress)}`}
          title={`Check out cool NFT by @${
            userProfile.twitter ? userProfile.twitter : ''
          } on @collectiverse!!`}
        >
          <TwitterIcon style={{ margin: '20px' }} size='40px' round />
        </TwitterShareButton>
      </Box>
    </div>
  );
}
