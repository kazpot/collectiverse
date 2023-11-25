import { useEffect, useState } from 'react';
import { Button, Grid, InputAdornment, TextField, Typography } from '@mui/material';
import { DropzoneArea } from 'mui-file-dropzone';
import { editUserProfile, getUserProfile } from '../../service/user';
import { UserProfile } from '../../common/types';
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/configureStore';
import { getCurrentUser } from '../../common/util';
import { client, ipfsFileUrl } from '../../common/ipfs';

export default function EditProfileForm() {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const currentUserAddress = useSelector((state: RootState) => state.currentUser);

  const [itemProperty, setItemProperty] = useState({} as any);

  useEffect(() => {
    async function init() {
      const user = await getCurrentUser();
      const userAddress = await user.getAddress();
      const userProf = await getUserProfile(userAddress);
      setItemProperty({ ...userProf });
    }
    init();
  }, []);

  const handleChange = (e: any) => {
    setItemProperty((prevProp: any) => {
      return {
        ...prevProp,
        [e.target.name]: e.target.value,
      };
    });
  };

  const coverImageHandler = async (files: any) => {
    const file = files[0];
    const filePromise = new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const fileContent = reader.result;
          resolve(fileContent);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = (error) => {
        reject(error);
      };
      if (file) {
        reader.readAsArrayBuffer(file);
      }
    });

    const fileInfo: ReadableStream<Uint8Array> = (await filePromise) as ReadableStream<Uint8Array>;
    const added = await client.add(fileInfo, { pin: true });
    const coverImage = `${ipfsFileUrl}${added.path}`;
    setItemProperty({ ...itemProperty, coverImage });
  };

  const profileImageHandler = async (files: any) => {
    const file = files[0];

    const filePromise = new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const fileContent = reader.result;
          resolve(fileContent);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = (error) => {
        reject(error);
      };
      if (file) {
        reader.readAsArrayBuffer(file);
      }
    });
    const fileInfo: ReadableStream<Uint8Array> = (await filePromise) as ReadableStream<Uint8Array>;

    const added = await client.add(fileInfo, { pin: true });
    const profileImage = `${ipfsFileUrl}${added.path}`;
    setItemProperty({ ...itemProperty, profileImage });
  };

  const handleSubmit = async () => {
    const profile: UserProfile = { ...itemProperty, address: currentUserAddress };
    if (!profile.username) {
      enqueueSnackbar('Username is required!', { variant: 'error' });
      return;
    }
    const res = await editUserProfile(profile);
    if (res) {
      enqueueSnackbar('Successfully profile is updated!', { variant: 'success' });
      router.push('/editprofile');
    } else {
      enqueueSnackbar('Failed to update profile!', { variant: 'error' });
    }
  };

  return (
    <Grid container spacing={3} direction='column' alignItems='center' justifyContent='center'>
      <Grid item>
        <Typography>Name</Typography>
        <TextField
          name='name'
          type='string'
          value={itemProperty.name}
          placeholder='No more than 15 characters'
          variant='filled'
          inputProps={{
            maxLength: 15,
            style: {
              fontSize: 20,
              width: 600,
            },
          }}
          onChange={handleChange}
        />
      </Grid>
      <Grid item>
        <Typography>Username</Typography>
        <TextField
          name='username'
          type='string'
          value={itemProperty.username && itemProperty.username.replace('@', '')}
          placeholder='No more than 15 characters'
          variant='filled'
          inputProps={{
            maxLength: 15,
            style: {
              fontSize: 20,
              width: 580,
            },
          }}
          InputProps={{
            startAdornment: <InputAdornment position='start'>@</InputAdornment>,
          }}
          onChange={handleChange}
        />
      </Grid>
      <Grid item>
        <Typography>Receive email notifications</Typography>
        <Typography variant='subtitle1'>
          <Typography variant='caption'>
            Add your email address to receive notifications about your activity on Foundation.
          </Typography>
        </Typography>
        <TextField
          name='email'
          type='string'
          value={itemProperty.email}
          placeholder='email'
          variant='filled'
          inputProps={{
            style: {
              fontSize: 20,
              width: 600,
            },
          }}
          onChange={handleChange}
        />
      </Grid>
      <Grid item>
        <Typography>Bio</Typography>
        <TextField
          name='bio'
          type='string'
          value={itemProperty.bio}
          placeholder='No more than 400 characters'
          multiline
          maxRows={4}
          variant='filled'
          inputProps={{
            maxLength: 400,
            style: {
              fontSize: 20,
              width: 600,
              height: 200,
            },
          }}
          onChange={handleChange}
        />
      </Grid>
      <Grid item>
        <Typography>Upload a profile image</Typography>
        <Typography variant='caption'>
          Recommended size: 500x500px. JPG, PNG, or GIF. 10MB max size.
        </Typography>
        <DropzoneArea
          fileObjects={[]}
          acceptedFiles={['image/*']}
          dropzoneText={'Drag and drop an image here or click'}
          onChange={profileImageHandler}
          maxFileSize={10485760}
          filesLimit={1}
          inputProps={{
            style: {
              width: 600,
            },
          }}
        />
      </Grid>
      <Grid item>
        <Typography>Upload a cover Image</Typography>
        <Typography variant='caption'>
          Recommended size: 1500x500px. JPG, PNG, or GIF. 10MB max size.
        </Typography>
        <DropzoneArea
          fileObjects={[]}
          acceptedFiles={['image/*']}
          dropzoneText={'Drag and drop an image here or click'}
          onChange={coverImageHandler}
          maxFileSize={10485760}
          filesLimit={1}
          inputProps={{
            style: {
              width: 600,
            },
          }}
        />
      </Grid>
      <Grid item>
        <Typography>WebSite</Typography>
        <TextField
          name='webSite'
          type='string'
          value={itemProperty.webSite}
          placeholder='Website URL'
          variant='filled'
          inputProps={{
            style: {
              fontSize: 20,
              width: 600,
            },
          }}
          onChange={handleChange}
        />
      </Grid>
      <Grid item>
        <Typography>Discord</Typography>
        <TextField
          name='discord'
          type='string'
          value={itemProperty.discord}
          placeholder='Code'
          variant='filled'
          inputProps={{
            style: {
              fontSize: 20,
              width: 585,
            },
          }}
          InputProps={{
            startAdornment: <InputAdornment position='start'>#</InputAdornment>,
          }}
          onChange={handleChange}
        />
      </Grid>
      <Grid item>
        <Typography>Twitter</Typography>
        <TextField
          name='twitter'
          type='string'
          value={itemProperty.twitter}
          placeholder='Twitter Username'
          variant='filled'
          inputProps={{
            style: {
              fontSize: 20,
              width: 585,
            },
          }}
          InputProps={{
            startAdornment: <InputAdornment position='start'>@</InputAdornment>,
          }}
          onChange={handleChange}
        />
      </Grid>
      <Grid item>
        <Typography>Instagram</Typography>
        <TextField
          name='instagram'
          type='string'
          value={itemProperty.instagram}
          placeholder='Instagram Username'
          variant='filled'
          inputProps={{
            style: {
              fontSize: 20,
              width: 390,
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>https://www.instagram.com/</InputAdornment>
            ),
          }}
          onChange={handleChange}
        />
      </Grid>
      <Grid item>
        <Button style={{ margin: '10px' }} variant='contained' onClick={handleSubmit}>
          Save Changes
        </Button>
      </Grid>
    </Grid>
  );
}
