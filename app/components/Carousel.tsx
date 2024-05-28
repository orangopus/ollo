import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useLoaderData, useOutletContext } from "@remix-run/react";
import { UserContext } from "context/UserContext";
import { useContext, useEffect, useState } from "react";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { SupabaseOutletContext } from "~/root";
import createSupabase from "utils/supabase";
library.add(fab, fas);

interface Profile {
  id: number;
  username: string;
  avatar: string;
  color: string;
  background_color: string;
  bio: string;
}

export default function Carousel() {
  const { supabase } = useOutletContext<SupabaseOutletContext>();
  const [profiles, setProfiles] = useState<Profile[]>([]);

  useEffect(() => {
    const fetchSocialsAndProfiles = async () => {
      const { data: profilesData, error: socialsError } = await supabase
        .from('profiles')
        .select('*');

      if (socialsError) {
        console.error(socialsError);
      } else {
        setProfiles(profilesData || []);
        console.log(profilesData);
      }
    };

    fetchSocialsAndProfiles();
  }, [supabase]);

  return (
    <div className="w-full">
      <div className="scroll">
        <div className="m-scroll">
          {profiles.map((profile) =>  ( profile.bio &&
            <Link to={`/${profile.username}`}>
            <div key={profile.id}style={{ backgroundImage: `url(${profile?.background_url})`, backdropFilter: "blur(4px)" }} className="profile-item grid-card dark p-5">
              <img className="avatar" src={profile.avatar ? profile.avatar : "avatar.png"} alt={profile.username} />
              <h2 className="username">{profile.username}</h2>
              <div className="mt-3">
              <p>{profile.bio}</p>
              </div>
            </div>
            </Link>
          ))}
        </div>
        <div className="swiper-pagination"></div>
      </div>
    </div>
  );
}
