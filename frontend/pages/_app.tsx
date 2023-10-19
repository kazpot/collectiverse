import { useEffect, useState } from 'react';
import { AppProps } from 'next/app';
import '../styles/globals.css';
import storeConfig from '../store/configureStore';
import { Provider } from 'react-redux';
import Web3Updater from '../components/Web3Updater';
import { useRouter } from 'next/router';
import ServerSideLoading from '../components/ServerSideLoading';
import { SnackbarProvider } from 'notistack';
import { CacheProvider, EmotionCache } from '@emotion/react';
import createEmotionCache from '../utils/createEmotionCache';

const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

function MyApp({ Component, pageProps, emotionCache = clientSideEmotionCache }: MyAppProps) {
  const store = storeConfig();
  const router = useRouter();

  const [pageLoading, setPageLoading] = useState(false);

  useEffect(() => {
    const handleStart = () => setPageLoading(true);
    const handleComplete = () => setPageLoading(false);

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  });

  useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles && jssStyles.parentElement) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
    <CacheProvider value={emotionCache}>
      <Provider store={store}>
        <SnackbarProvider>
          <Web3Updater />
          {pageLoading && <ServerSideLoading />}
          {!pageLoading && <Component {...pageProps} />}
        </SnackbarProvider>
      </Provider>
    </CacheProvider>
  );
}
export default MyApp;
