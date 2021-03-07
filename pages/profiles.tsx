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
      <div className="row profilescont">
        <h1>Profiles</h1>
      </div>
      <div className="row profilescont paddingcards paddinghero">
        {profile
          .filter((n) => n.username)
          .map((profile) => (
            <div className="col-4">
              <div
                className="flex cards profilecont"
                style={{ backgroundImage: `url(${profile.background_url})` }}
              >
                <div className="avatarcont">
                  <a href={`/${profile.username}`} target="_blank">
                    <img className="avatar" src={profile.avatar} />
                  </a>
                </div>
                <div className="info marginone">
                  <a href={`/${profile.username}`} target="_blank">
                    <h1 className="username">
                      {profile.displayname
                        ? profile.displayname
                        : profile.username}{" "}
                      <span className="handle">@{profile.username}</span>
                    </h1>
                  </a>
                  <p className="bio">{profile.bio}</p>
                </div>
              </div>
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
