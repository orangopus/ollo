import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "@remix-run/react";
import { UserContext } from "context/UserContext";
import { useContext } from "react";

export default function Nav() {
  const user = useContext(UserContext);

  console.log(user)

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
        {user && (
          <Link className="flex center" to="/dashboard">
            {user?.user_metadata.avatar_url && (
              <img
                className="avatar avatar2 center"
                style={{ marginTop: "-25px" }}
                src={user.user_metadata.avatar_url}
                alt="User Avatar"
              />
            )}
          </Link>
        )}
      </form>
    </nav>
  );
}