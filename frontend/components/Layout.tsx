import Head from 'next/head';
import { ethers } from 'ethers';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import {
  AppBar,
  Toolbar,
  Typography,
  Link,
  InputBase,
  IconButton,
  Menu,
  MenuItem,
  Button,
  Box,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import NextLink from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/configureStore';
import { useEffect, useState } from 'react';
import { signUp, isUser } from '../service/user';
import { useRouter } from 'next/router';
import { getCurrentUser, shortAddress } from '../common/util';
import classes from '../utils/classes';
import { chains } from '../common/const';
import Image from 'next/image';
import { useSnackbar } from 'notistack';
import { currentUserChanged } from '../actions/currentUser.actions';

type Props = {
  title?: string;
  description?: string;
  children: any;
};

export default function Layout({ title, description, children }: Props) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const darkMode: boolean = useSelector((state: RootState) => state.darkMode);
  const currentUserAddress: string = useSelector((state: RootState) => state.currentUser);
  const chainId: number = parseInt(useSelector((state: RootState) => state.chainId));

  const [signed, setSigned] = useState(false);
  const [query, setQuery] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    async function init() {
      if (!window.ethereum) {
        setSigned(false);
        return;
      }

      const res = await isUser(ethers.utils.getAddress(currentUserAddress));
      if (res) {
        setSigned(res);
      }
    }
    init();
  }, [currentUserAddress, dispatch]);

  const theme = createTheme({
    typography: {
      h1: {
        fontSize: '1.6rem',
        fontWeight: 400,
        margin: '1rem 0',
      },
      h2: {
        fontSize: '1.4rem',
        fontWeight: 400,
        margin: '1rem 0',
      },
    },
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#f0c000',
      },
      secondary: {
        main: '#208080',
      },
    },
  });

  const queryChangeHandler = (e: any) => {
    setQuery(e.target.value);
  };

  const submitHandler = (e: any) => {
    e.preventDefault();
    router.push(`/search?query=${query}`);
  };

  const userClickHandler = (e: any) => {
    setAnchorEl(e.currentTarget);
  };

  const userMenuCloseHandler = () => {
    setAnchorEl(null);
  };

  const aboutHandler = () => {
    router.push(`/about/${currentUserAddress}`);
  };

  const collectionHandler = () => {
    router.push('/create-collection');
  };

  const handleSignIn = async () => {
    if (!window.ethereum) {
      enqueueSnackbar('No wallet found! Failed to sign in...', { variant: 'error' });
      setSigned(false);
      return;
    }

    const user = await getCurrentUser();
    const userAddress = await user.getAddress();

    const res = await isUser(userAddress);
    if (res) {
      setSigned(true);
      dispatch(currentUserChanged(userAddress));
    } else {
      const isSignedUp = await signUp(userAddress);
      if (isSignedUp) {
        setSigned(true);
        dispatch(currentUserChanged(userAddress));
      } else {
        setSigned(false);
      }
    }
  };

  return (
    <div>
      <Head>
        <title>{title ? `${title} - CollectiVerse` : 'CollectiVerse'}</title>
        {description && <meta name='description' content={description}></meta>}
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppBar position='static' elevation={0} sx={classes.navbar}>
          <Toolbar sx={classes.toolbar}>
            <NextLink href='/' passHref>
              <Image
                src='/assets/logo_400x72.png'
                width={400}
                height={72}
                alt='Picture of the author'
              />
            </NextLink>
            <Box
              sx={{
                [theme.breakpoints.down('lg')]: {
                  display: 'none',
                },
              }}
            >
              <form onSubmit={submitHandler}>
                <Box sx={classes.searchForm}>
                  <IconButton type='submit' sx={classes.iconButton} aria-label='search'>
                    <SearchIcon />
                  </IconButton>
                  <InputBase
                    name='query'
                    sx={classes.searchInput}
                    placeholder='Search items, collections, and profiles'
                    onChange={queryChangeHandler}
                  />
                </Box>
              </form>
            </Box>
            <div>
              <NextLink href='/' passHref>
                <Link style={{ textDecoration: 'none' }}>Market</Link>
              </NextLink>
              <NextLink href='/search' passHref>
                <Link style={{ textDecoration: 'none' }}>Explore</Link>
              </NextLink>
              {signed && chains[chainId] && (
                <NextLink href={`/create/${currentUserAddress}`} passHref>
                  <Link style={{ textDecoration: 'none' }}>Create</Link>
                </NextLink>
              )}
              {signed && chains[chainId] && (
                <Button
                  aria-controls='user-menu'
                  sx={classes.navbarButton}
                  onClick={userClickHandler}
                >
                  {shortAddress(currentUserAddress, chains[chainId].chainName)}
                </Button>
              )}
              {signed && chains[chainId] && (
                <Menu
                  id='user-menu'
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={userMenuCloseHandler}
                >
                  {signed && <MenuItem onClick={aboutHandler}>View Profile</MenuItem>}
                  {signed && <MenuItem onClick={collectionHandler}>Create Collection</MenuItem>}
                </Menu>
              )}
              {!signed && (
                <Button
                  aria-controls='user-menu'
                  sx={classes.navbarButton}
                  onClick={() => handleSignIn()}
                >
                  SignIn
                </Button>
              )}
            </div>
          </Toolbar>
        </AppBar>
        {children}
        <footer style={{ marginTop: 10, textAlign: 'center' }}>
          <Typography>@2023 CollectiVerse</Typography>
        </footer>
      </ThemeProvider>
    </div>
  );
}
