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
        <title>Explore | ollo</title>
      </Head>
      <div className="profilescont" >
        <h1 className="text-3xl font-bold">
          Explore{" "}
          <span className="verified">
            {searchResults.filter((n) => n.username).length}
          </span>
        </h1>
        <input
          className="cards search mt-10"
          placeholder="Search for an ollo..."
          value={searchTerm}
          onChange={handleChange}
        ></input>
      </div>
      <div className="grid profilescont grid-cols-8 gap-5 paddinghero">
        {searchResults
          .filter((n) => n.username)
          .sort((a, b) => a.username.localeCompare(b.username))
          .map((profile) => (
            <>
              <div className="grid col-span-2 auto-rows-max">
                <div className="cards center paddingnone justify-center items-center overflow-hidden md:max-w-sm rounded-lg shadow-sm mx-auto"></div>
                <a href={`/${profile.username}`} className="none">
                  <div className="grid-card dark p-5">
                    <div className="center avatarcont">
                      <ImageFallback
                        data-tip
                        data-for={profile.username}
                        className="avatar center"
                        fallbackImage="avatar.png"
                        src={profile.avatar}
                      />
                    </div>
                    <div className="info mt-4 center"><h1 className="username center">{profile.username}
                      <div>
                        <span className="handle">{profile.handle}</span></div></h1>
                    </div>
                  </div>
                </a>
              </div>
            </>
          ))}
      </div>
      <div className="mb-10"></div>
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
