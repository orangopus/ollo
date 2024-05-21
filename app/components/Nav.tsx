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
  const profile = await supabase.from("profiles").select("*").eq("id", user.data.session.user.id).single()

  return {
    user: user.data,
    profile: profile.data
  }
    
};

export default function Nav() {
  const user = useLoaderData()
  const profile = useLoaderData()

  return (
    <nav className="navbar flex justify-between justify-center">
      <a className="navbar-brand" href="/">
        <img className="logo" src="../logo.svg" alt="Logo" />
      </a>
      <form className="form-inline navlink">
        <Link to="/home" className="buttonwhite">
          <FontAwesomeIcon className="navicon" icon={["fas", "stream"]} /> home
        </Link>
        <Link to="/explore" className="buttonwhite">
          <FontAwesomeIcon className="navicon" icon={["fas", "shapes"]} /> explore
        </Link>
        {user.session ? (
          <Link className="flex center" to={`/${profile}`}>
            {user?.session.user.user_metadata.avatar_url && (
              <img
                className="avatar avatar2 center"
                style={{ marginTop: "-25px" }}
                src={user?.session.user.user_metadata.avatar_url}
                alt="User Avatar"
              />
            )}
            {JSON.stringify(profile.id)}
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