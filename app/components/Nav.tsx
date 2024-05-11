import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "@remix-run/react";
import { UserContext } from "context/UserContext";
import { useContext } from "react";

export default function Nav(){
    const user = useContext(UserContext);
    return (
          <nav className="navbar flex justify-between justify-center">
            <a className="navbar-brand" href="/">
              <img className="logo" src="../logo.svg" />
            </a>
            <form className="form-inline navlink">
              <Link to="/home">
                <button className="buttonwhite">
                  <FontAwesomeIcon className="navicon" icon={["fas", "stream"]} />{" "}
                  home
                </button>
              </Link>
              <Link to="/explore">
                <button className="buttonwhite">
                  <FontAwesomeIcon className="navicon" icon={["fas", "shapes"]} />{" "}
                  explore
                </button>
              </Link>
              <Link className="flex center" to="/dashboard">
                  <img className="avatar avatar2 center" style={{marginTop: '-25px'}} src={`${user?.user_metadata.avatar_url}`} />
              </Link>
            </form>
          </nav>
        );

    }