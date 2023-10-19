import { Cancel } from '@mui/icons-material';
import { Stack, TextField, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useRef, useState } from 'react';

const Tags = ({ data, handleDelete }: { data: any; handleDelete: any }) => {
  return (
    <Box
      sx={{
        background: '#283240',
        height: '100%',
        display: 'flex',
        padding: '0.4rem',
        margin: '0 0.5rem 0 0',
        justifyContent: 'center',
        alignContent: 'center',
        color: '#ffffff',
      }}
    >
      <Stack direction='row' gap={1}>
        <Typography>{data}</Typography>
        <Cancel
          sx={{ cursor: 'pointer' }}
          onClick={() => {
            handleDelete(data);
          }}
        />
      </Stack>
    </Box>
  );
};

interface InputTagsProps {
  // eslint-disable-next-line no-unused-vars
  tagsHandler: (parsms: string[]) => Promise<void>;
}

export default function InputTags({ tagsHandler }: InputTagsProps) {
  const [tags, SetTags] = useState<any[]>([]);

  const tagRef = useRef<any>();

  const handleDelete = async (value: string) => {
    const newtags = tags.filter((val: string) => val !== value);
    SetTags(newtags);
    await tagsHandler(newtags);
  };

  const handleOnSubmit = async (e: any) => {
    e.preventDefault();
    if (!tagRef || !tagRef.current) {
      return;
    }
    SetTags([...tags, tagRef.current.value]);
    await tagsHandler([...tags, tagRef.current.value]);
    tagRef.current.value = '';
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <form onSubmit={handleOnSubmit}>
        <TextField
          name='Tags'
          inputRef={tagRef}
          fullWidth
          variant='filled'
          placeholder={tags.length < 5 ? 'Enter tags' : ''}
          InputProps={{
            style: {
              color: 'white',
              fontSize: 20,
              width: 600,
            },
            startAdornment: (
              <Box sx={{ margin: '0 0.2rem 0 0', display: 'flex' }}>
                {tags.map((data, index) => {
                  return <Tags data={data} handleDelete={handleDelete} key={index} />;
                })}
              </Box>
            ),
          }}
        />
      </form>
    </Box>
  );
}
