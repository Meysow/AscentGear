import type { AppProps } from 'next/app';
import { StoreProvider } from '../app/utils/Store';
import '../app/styles/_globals.scss';

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <StoreProvider>
            <Component {...pageProps} />
        </StoreProvider>
    );
}

export default MyApp;
