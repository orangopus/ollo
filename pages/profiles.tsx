import Head from "next/head";
import Nav from "../components/Nav";
import Link from "next/link";
import { supabase } from "../utils/initSupabase";
import Tilt from "react-parallax-tilt";
import ReactTooltip from "react-tooltip";

export default function Index({ profile }) {
  return (
    <div>
      <Head>
        <title>libby Profiles</title>
      </Head>
      <div className="profilescont">
        <h1>
          Profiles{" "}
          <span className="verified">
            {profile.filter((n) => n.username).length}
          </span>
        </h1>
        <input
          className="cards search"
          placeholder="Search for a profile..."
        ></input>
      </div>
      <div className="row profilescont paddingcards paddinghero">
        {profile
          .filter((n) => n.username)
          .map((profile) => (
            <div className="col-4">
              <a href={`/${profile.username}`} className="none" target="_blank">
                <div
                  className="cards grow profilecont"
                  style={{ backgroundImage: `url(${profile.background_url})` }}
                >
                  <div className="avatarcont">
                    <img className="avatar" src={profile.avatar} />
                  </div>
                  <div className="info marginone">
                    <h1 className="username">
                      {profile.displayname
                        ? profile.displayname
                        : profile.username}{" "}
                      <br />
                      <span className="handle">@{profile.username}</span>
                    </h1>
                    <p className="bio">{profile.bio}</p>
                  </div>
                </div>
              </a>
            </div>
          ))}
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  const { body, error } = await supabase.from("profiles").select("*");
  if (!body) {
    return {
      notFound: true,
    };
  }
  return {
    props: {
      profile: body,
    }, // will be passed to the page component as props
  };
}
