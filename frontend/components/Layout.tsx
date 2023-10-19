import Head from 'next/head';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import {
  AppBar,
  Toolbar,
  Typography,
  Link,
  Switch,
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
import { darkModeOff, darkModeOn } from '../actions/dark.actions';
import { useEffect, useState } from 'react';
import { isApproved } from '../service/order';
import { useRouter } from 'next/router';
import { shortAddress } from '../common/util';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import classes from '../utils/classes';
import TopSnackbar from './TopSnackbar';
import { chains } from '../common/const';

type Props = {
  title?: string;
  description?: string;
  children: any;
};

export default function Layout({ title, description, children }: Props) {
  const dispatch = useDispatch();
  const router = useRouter();

  const darkMode: boolean = useSelector((state: RootState) => state.darkMode);
  const currentUserAddress: string = useSelector((state: RootState) => state.currentUser);
  const chainId: number = parseInt(useSelector((state: RootState) => state.chainId));

  const [approved, setApproved] = useState(false);
  const [query, setQuery] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [topSnackOpen, setTopSnackOpen] = useState(false);
  const [topSnackText, setTopSnackText] = useState('');

  useEffect(() => {
    async function init() {
      try {
        const res = await isApproved();
        setApproved(res);
        setTopSnackOpen(false);
      } catch (e: any) {
        setTopSnackOpen(true);
        setTopSnackText('Please check if your wallet connects to right chain');
        console.log(e);
      }
    }
    init();
  });

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

  const darkModeChangeHandler = () => {
    darkMode ? dispatch(darkModeOff()) : dispatch(darkModeOn());
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

  return (
    <div>
      <Head>
        <title>{title ? `${title} - ARTBASE` : 'ARTBASE'}</title>
        {description && <meta name='description' content={description}></meta>}
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppBar position='static' elevation={0} sx={classes.navbar}>
          <Toolbar sx={classes.toolbar}>
            <NextLink href='/' passHref>
              <Link style={{ textDecoration: 'none' }}>
                <Typography sx={classes.brand}>ARTBASE</Typography>
              </Link>
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
              {approved && (
                <NextLink href={`/create/${currentUserAddress}`} passHref>
                  <Link style={{ textDecoration: 'none' }}>Create</Link>
                </NextLink>
              )}
              <Button
                aria-controls='user-menu'
                sx={classes.navbarButton}
                onClick={userClickHandler}
              >
                {chains[chainId] && shortAddress(currentUserAddress, chains[chainId].chainName)}
              </Button>
              <Menu
                id='user-menu'
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={userMenuCloseHandler}
              >
                <MenuItem onClick={aboutHandler}>View Profile</MenuItem>
                {approved && <MenuItem onClick={collectionHandler}>Create Collection</MenuItem>}
                <MenuItem>
                  Dark Mode <DarkModeIcon style={{ verticalAlign: 'middle' }} />
                  <Switch checked={darkMode} onChange={darkModeChangeHandler}></Switch>
                </MenuItem>
              </Menu>
            </div>
          </Toolbar>
        </AppBar>
        {children}
        <footer style={{ marginTop: 10, textAlign: 'center' }}>
          <Typography>@2023 ARTBASE</Typography>
        </footer>
      </ThemeProvider>
      <TopSnackbar text={topSnackText} open={topSnackOpen} />
    </div>
  );
}
