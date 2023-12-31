import { useEffect, useState } from 'react';
import { Button, Grid, TextField, Typography, InputAdornment } from '@mui/material';
import { DropzoneArea } from 'mui-file-dropzone';
import { CollectionProfile } from '../../common/types';
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/configureStore';
import { client, ipfsFileUrl } from '../../common/ipfs';
import { editCollectionProfile } from '../../service/collection';

type Props = {
  collection: CollectionProfile;
};

export default function EditCollectionForm({ collection }: Props) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const currentUserAddress = useSelector((state: RootState) => state.currentUser);

  const [itemProperty, setItemProperty] = useState({
    name: '',
    collectionId: '',
    description: '',
    webSite: '',
    discord: '',
    twitter: '',
    instagram: '',
    coverImage: '',
    cardImage: '',
    createdBy: '',
  });
  const [errors, setErrors] = useState({} as any);

  useEffect(() => {
    async function init() {
      setItemProperty({ ...collection });
    }
    init();
    setErrors({});
  }, [collection]);

  const uploadIpfs = async (file: any): Promise<string> => {
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
    return added.path;
  };

  const handleChange = async (e: any) => {
    setItemProperty((prevProp: any) => {
      return {
        ...prevProp,
        [e.target.name]: e.target.value,
      };
    });
  };

  const coverImageHandler = async (files: any) => {
    const file = files[0];
    const path = await uploadIpfs(file);
    const coverImage = `${ipfsFileUrl}${path}`;
    setItemProperty({ ...itemProperty, coverImage });
  };

  const cardImageHandler = async (files: any) => {
    const file = files[0];
    const path = await uploadIpfs(file);
    const cardImage = `${ipfsFileUrl}${path}`;
    setItemProperty({ ...itemProperty, cardImage });
  };

  const handleSubmit = async () => {
    const collProfile: CollectionProfile = {
      ...itemProperty,
      createdBy: currentUserAddress,
      user: [],
      items: [],
    };
    if (!collProfile.name || !collProfile.collectionId) {
      enqueueSnackbar('Failed to submit collection! Please check Name and URL!', {
        variant: 'error',
      });
      return;
    }
    const res = await editCollectionProfile(collProfile);
    if (res) {
      enqueueSnackbar('Successfully collection is updated!', { variant: 'success' });
      router.push(`/collection/${collProfile.collectionId}`);
    } else {
      enqueueSnackbar('Failed to update collection!', { variant: 'error' });
    }
  };

  const handleDelete = () => {
    console.log('not implemented delete');
  };

  return (
    <Grid container spacing={3} direction='column' alignItems='center' justifyContent='center'>
      <Grid item>
        <Typography>Name</Typography>
        <TextField
          disabled
          required
          label='Required'
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
          {...(errors['name'] && { error: true, helperText: errors['name'] })}
        />
      </Grid>
      <Grid item>
        <Typography>URL</Typography>
        <Typography variant='subtitle1'>
          <Typography variant='caption'>
            Customize your URL on CollectiVerse. Must only contain lowercase letters,numbers, and
            hyphens.
          </Typography>
        </Typography>
        <TextField
          disabled
          required
          label='Required'
          name='collectionId'
          type='string'
          value={itemProperty.collectionId}
          placeholder='your-collection'
          variant='filled'
          inputProps={{
            style: {
              fontSize: 20,
              width: 390,
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                https://collectiverse.com/collection/
              </InputAdornment>
            ),
          }}
          onChange={handleChange}
          {...(errors['collectionId'] && { error: true, helperText: errors['collectionId'] })}
        />
      </Grid>
      <Grid item>
        <Typography>Description</Typography>
        <TextField
          name='description'
          type='string'
          value={itemProperty.description}
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
        <Typography>Upload a card image</Typography>
        <Typography variant='caption'>
          Recommended size: 1400x2000px. JPG, PNG, or GIF. 10MB max size.
        </Typography>
        <DropzoneArea
          fileObjects={[]}
          acceptedFiles={['image/*']}
          dropzoneText={'Drag and drop an image here or click'}
          onChange={cardImageHandler}
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
        <Button
          style={{ margin: '10px' }}
          variant='contained'
          onClick={handleDelete}
          sx={{ backgroundColor: 'red', color: 'white' }}
        >
          Delete
        </Button>
      </Grid>
    </Grid>
  );
}
