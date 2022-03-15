import type { AppProps } from 'next/app';
import { StoreProvider } from '../app/utils/Store';
import '../app/styles/_globals.scss';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';

import NProgress from 'nprogress';
import Router from 'next/router';
import 'nprogress/nprogress.css';

NProgress.configure({
    minimum: 0.3,
    easing: 'ease',
    speed: 800,
    showSpinner: false,
});

Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <StoreProvider>
            <PayPalScriptProvider
                options={{ 'client-id': 'test' }}
                deferLoading={true}
            >
                <Component {...pageProps} />
            </PayPalScriptProvider>
        </StoreProvider>
    );
}

export default MyApp;
