import "../styles.css";
import "../bootstrap.css";
import Nav from "../components/Nav"
import Footer from "../components/Footer"
import { Auth } from '@supabase/ui'
import { supabase } from '../utils/initSupabase'
import Head from "next/head"

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }) {
  if (typeof window === 'undefined') {
    return null
  }

  window.onbeforeunload = function () {
    window.scrollTo(0, 0);
  }

  return (
    <>
      <Head>
      <title>libby</title>
      <link rel="icon" type="image/png" href="favicon.png"></link>
      </Head>
      <Nav />
      <Auth.UserContextProvider supabaseClient={supabase}>
        <Component {...pageProps} />
      </Auth.UserContextProvider>
      <Footer />
    </>
  );
}