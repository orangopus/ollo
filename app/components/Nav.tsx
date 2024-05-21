import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useLoaderData } from "@remix-run/react";
import { UserContext } from "context/UserContext";
import { useContext } from "react";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";
library.add(fab, fas);

// load posts from database
export const loader = async ({ request }: LoaderArgs) => {
  const response = new Response();
  const supabase = createServerSupabase({ request, response });

  const posts = await supabase.from("posts_with_likes").select().order('id', { ascending: false });
  const likes = await supabase.from("likes").select();

  const user = await supabase.auth.getUser()

  return {
    user: user.data,
  }
    
};

export default function Nav() {
  const user = useLoaderData()

  return (
    <nav className="navbar flex justify-between justify-center">
      <a className="navbar-brand" href="/">
        <img className="logo" src="../logo.svg" alt="Logo" />
      </a>
      <div id="toast-default" className="flex items-center w-full max-w-xs p-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800" role="alert">
    <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-blue-500 bg-blue-100 rounded-lg dark:bg-blue-800 dark:text-blue-200">
        <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 20">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.147 15.085a7.159 7.159 0 0 1-6.189 3.307A6.713 6.713 0 0 1 3.1 15.444c-2.679-4.513.287-8.737.888-9.548A4.373 4.373 0 0 0 5 1.608c1.287.953 6.445 3.218 5.537 10.5 1.5-1.122 2.706-3.01 2.853-6.14 1.433 1.049 3.993 5.395 1.757 9.117Z"/>
        </svg>
        <span className="sr-only">Fire icon</span>
    </div>
    <div className="ms-3 text-sm font-normal">Pleaae login with Discord with the same email as your ollo email.</div>
</div>
      <form className="form-inline navlink">
        <Link to="/home" className="buttonwhite">
          <FontAwesomeIcon className="navicon" icon={["fas", "stream"]} /> home
        </Link>
        <Link to="/explore" className="buttonwhite">
          <FontAwesomeIcon className="navicon" icon={["fas", "shapes"]} /> explore
        </Link>
        {user.session ? (
          <Link className="flex center" to="/login">
            {user?.session.user.user_metadata.avatar_url && (
              <img
                className="avatar avatar2 center"
                style={{ marginTop: "-25px" }}
                src={user?.session.user.user_metadata.avatar_url}
                alt="User Avatar"
              />
            )}
          </Link>
        ) : (!user.session && (
          <Link to="/login">
            <button className="button" style={{ marginTop: "-10px" }}>Login</button>
          </Link>
        ))}
      </form>
    </nav>
  );
}