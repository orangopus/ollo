import { useLoaderData } from "@remix-run/react";
import { useState, useEffect } from "react";
import type { LoaderFunctionArgs } from "@remix-run/node";
import ImageFallback from "react-image-fallback";
import { SupabaseOutletContext } from "~/root";
import supabase from "utils/supabase";

export const loader: LoaderFunctionArgs = async ({ request, response }) => {
  const supabaseClient = supabase(request);

  const { data: profile, error } = await supabaseClient.from("profiles").select("*");

  if (error) {
    throw new Error(error.message);
  }

  return { profile };
};

export default function Index() {
  const { profile } = useLoaderData();
  const avatar = "avatar.png";

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    if (profile) {
      const results = profile.filter(
        (profile) =>
          profile.username !== null &&
          profile.username.toLowerCase().includes(searchTerm)
      );
      setSearchResults(results);
    }
  }, [searchTerm, profile]);

  return (
    <div>
      <title>Explore | ollo</title>
      <div className="profilescont">
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
            <div key={profile.id} className="grid col-span-2 auto-rows-max">
              <div className="cards center paddingnone justify-center items-center overflow-hidden md:max-w-sm rounded-lg shadow-sm mx-auto">
                <a href={`/${profile.username}`} className="none">
                  <div className="grid-card dark p-5">
                    <div className="center avatarcont">
                      <img className="avatar" src={profile.avatar === null ? avatar : profile.avatar} />
                    </div>
                    <div className="info mt-4 center">
                      <h1 className="username center">{profile.username}</h1>
                      <div>
                        <span className="handle">{profile.handle}</span>
                      </div>
                    </div>
                  </div>
                </a>
              </div>
            </div>
          ))}
      </div>
      <div className="mb-10"></div>
    </div>
  );
}