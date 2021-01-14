import Head from "next/head";
import { signIn, signOut, useSession } from "next-auth/client";

const Nav = () => {
  const [session, loading] = useSession();
  if (session) {
    return (
      <nav className="navbar">
        <a className="navbar-brand" href="/"><img className="logo" src="logo.png" /></a>
        <form className="form-inline">
          <button onClick={() => signOut()} className="button">logout</button>
        </form>
      </nav>
    );
  } else {
    return (
      <nav className="navbar">
        <a className="navbar-brand" href="/"><img className="logo" src="logo.png" /></a>
        <form className="form-inline">
          <button onClick={(e) => { e.preventDefault(); window.location.href = '/pricing'; }}
            className="buttonwhite">pricing</button>
          <button onClick={() => signIn()} className="button">login</button>
        </form>
      </nav>
    );
  }
}

export default Nav;
