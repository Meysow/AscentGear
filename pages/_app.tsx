import type { AppProps } from 'next/app';
import { StoreProvider } from '../app/utils/Store';
import '../app/styles/_globals.scss';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <StoreProvider>
            <PayPalScriptProvider deferLoading={true}>
                <Component {...pageProps} />
            </PayPalScriptProvider>
        </StoreProvider>
    );
}

export default MyApp;
