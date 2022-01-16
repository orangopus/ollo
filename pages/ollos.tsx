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
        <title>ollos | ollo</title>
      </Head>
      <div className="profilescont">
        <h1 className="text-3xl font-bold">
          Ollos{" "}
          <span className="verified">
            {searchResults.filter((n) => n.username).length}
          </span>
        </h1>
        <input
          className="cards search"
          placeholder="Search for an ollo..."
          value={searchTerm}
          onChange={handleChange}
        ></input>
      </div>
      <div className="row profilescont paddinghero">
        {searchResults
          .filter((n) => n.username)
          .sort((a, b) => a.username.localeCompare(b.username))
          .map((profile) => (
            <>
              <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-3">
                <div className="cards paddingnone w-full justify-center items-center overflow-hidden md:max-w-sm rounded-lg shadow-sm mx-auto"></div>
                <a href={`/${profile.username}`} className="none">
                  <div className="cards paddingnone grow profilecont">
                    <div className="relative h-50">
                      <ImageFallback
                        data-tip
                        data-for={profile.username}
                        className="absolute h-full w-full object-cover rounded-t-lg"
                        fallbackImage="https://pwchtpxjolxhjfamtxrb.supabase.co/storage/v1/object/sign/uploads/magic-pattern-geometric-1620664953241.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ1cGxvYWRzL21hZ2ljLXBhdHRlcm4tZ2VvbWV0cmljLTE2MjA2NjQ5NTMyNDEucG5nIiwiaWF0IjoxNjIwNjY1MDI2LCJleHAiOjE5MzYwMjUwMjZ9.up1i4crV7CcfYtGKxBXfYVA3wpB3AI6JXVBXHvQWbVs"
                        src={profile.background_url}
                      />
                    </div>
                    <div className="relative shadow h-25 w-25 -my-14 ml-5">
                      <ImageFallback
                        data-tip
                        data-for={profile.username}
                        className="avatar avatarcreator"
                        fallbackImage="avatar.png"
                        src={profile.avatar}
                      />
                    </div>
                    <div className="mt-9 ml-5 mr-5">
                      <h1 className="username text-left">
                        {profile.displayname
                          ? profile.displayname
                          : profile.username}{" "}
                        <br />
                        <span className="handle">@{profile.username}</span>
                      </h1>
                      <p className="text-xl text-gray-600 text-left mt-4 font-black">
                        {profile.bio}
                      </p>
                    </div>
                  </div>
                </a>
              </div>
            </>
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
