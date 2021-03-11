import Link from "next/link";
import useSWR from "swr";
import { Auth, Card, Typography, Space, Button, Icon } from "@supabase/ui";
import { supabase } from "../utils/initSupabase";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Dropdown } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";

library.add(fab, fas);

const fetcher = (url, token) =>
  fetch(url, {
    method: "GET",
    headers: new Headers({ "Content-Type": "application/json", token }),
    credentials: "same-origin",
  }).then((res) => res.json());

export default function Nav() {
  const session = supabase.auth.session();
  const router = useRouter();

  const { data, error } = useSWR(
    session ? ["/api/getUser", session.access_token] : null,
    fetcher
  );
  const [authView, setAuthView] = useState("sign_in");
  const [profile, setProfile] = useState([]);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "PASSWORD_RECOVERY") setAuthView("update_password");
        if (event === "USER_UPDATED")
          setTimeout(() => setAuthView("sign_in"), 1000);
        // Send session to /api/auth route to set the auth cookie.
        // NOTE: this is only needed if you're doing SSR (getServerSideProps)!
        fetch("/api/auth", {
          method: "POST",
          headers: new Headers({ "Content-Type": "application/json" }),
          credentials: "same-origin",
          body: JSON.stringify({ event, session }),
        }).then((res) => res.json());
      }
    );

    async function fetchProfile() {
      const { body, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      setProfile(body.avatar);
    }

    fetchProfile();

    return () => {
      authListener.unsubscribe();
    };
  }, [profile]);

  if (session) {
    return (
      <nav className="navbar">
        <a className="navbar-brand" href="/">
          <img className="logo" src="../logo.png" />
        </a>
        <form className="form-inline">
          <Link href="/feed">
            <button className="buttonwhite">feed</button>
          </Link>
          <Link href="/profiles">
            <button className="buttonwhite">profiles</button>
          </Link>
          <Dropdown>
            <Dropdown.Toggle variant="success">
              <img
                className="avatar avatar2"
                src={`${
                  profile
                    ? profile
                    : "https://pbs.twimg.com/profile_images/1347491939088814082/tgUmYLxH_400x400.jpg"
                }`}
              />
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item>
                <Link href="/dashboard/edit">
                  <button className="buttonwhite">
                    <FontAwesomeIcon icon={["fas", "paint-brush"]} /> edit
                    profile
                  </button>
                </Link>
              </Dropdown.Item>
              <Dropdown.Item>
                <Link href="/pro">
                  <button className="buttonwhite probutton">
                    <FontAwesomeIcon icon={["fas", "unlock-alt"]} /> upgrade to
                    pro
                  </button>
                </Link>
              </Dropdown.Item>
              <hr className="sep" />
              <Dropdown.Item>
                <button
                  onClick={() => {
                    supabase.auth.signOut();
                    router.push("/");
                  }}
                  className="buttonwhite logout"
                >
                  <FontAwesomeIcon icon={["fas", "sign-out-alt"]} /> logout
                </button>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </form>
      </nav>
    );
  } else {
    return (
      <nav className="navbar">
        <a className="navbar-brand" href="/">
          <img className="logo" src="../logo.png" />
        </a>
        <form className="form-inline">
          <Link href="/feed">
            <button className="buttonwhite">feed</button>
          </Link>
          <Link href="/profiles">
            <button className="buttonwhite">profiles</button>
          </Link>
          <Link href="/dashboard">
            <button className="button">login</button>
          </Link>
        </form>
      </nav>
    );
  }
}

export async function getServerSideProps({ req }) {
  const session = supabase.auth.session();
  const { user } = await supabase.auth.api.getUserByCookie(req);
  const { body, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", session.user.id)
    .single();

  console.log(session.user.id);

  if (!body) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      profile: body,
    },
  };
}
