import "../styles.css";
import "../bootstrap.css";
import Head from "next/head";
import { Provider } from "next-auth/client";
import { AppProps } from "next/app";
import Footer from "../components/Footer"

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }) {
  if (typeof window === 'undefined') {
    return null
  }

  return (
    <>
      <Provider session={pageProps.session}>
        <Component {...pageProps} />
      </Provider>
      <Footer />
    </>
  );
}