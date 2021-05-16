import Head from "next/head";
import { supabase } from "../utils/initSupabase";
import { useState, useEffect } from "react";
import ImageFallback from "react-image-fallback";

export default function Index({ profile }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };
  useEffect(() => {
    const results = profile.filter(
      (profile) =>
        profile.username !== null &&
        profile.username.toLowerCase().includes(searchTerm)
    );
    setSearchResults(results);
  }, [searchTerm]);

  return (
    <div>
      <Head>
        <title>Creators | Libby</title>
      </Head>
      <div className="profilescont">
        <h1 className="text-3xl font-bold">
          Creators{" "}
          <span className="verified">
            {searchResults.filter((n) => n.username).length}
          </span>
        </h1>
        <input
          className="cards search"
          placeholder="Search for a creator..."
          value={searchTerm}
          onChange={handleChange}
        ></input>
      </div>
      <div className="row profilescont paddingcards paddinghero">
        {searchResults
          .filter((n) => n.username)
          .sort((a, b) => a.username.localeCompare(b.username))
          .map((profile) => (
            <div className="col-4">
              <a href={`/${profile.username}`} className="none">
                <div
                  className="cards grow profilecont"
                  style={{ backgroundImage: `url(${profile.background_url})` }}
                >
                  <div className="avatarcont">
                    <ImageFallback
                      data-tip
                      data-for={profile.username}
                      className="avatar center"
                      fallbackImage="avatar.png"
                      src={profile.avatar}
                    />
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
