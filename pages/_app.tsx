import "../styles.css";
import "tailwindcss/tailwind.css";
import { Auth } from "@supabase/ui";
import { supabase } from "../utils/initSupabase";
import Nav from "../components/Nav";
import Footer from "../components/Footer";

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Nav/>
      <Auth.UserContextProvider supabaseClient={supabase}>
        <Component {...pageProps} />
      </Auth.UserContextProvider>
      <Footer/>
    </>
  );
}
