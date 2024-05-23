import { useLoaderData, useOutletContext } from "@remix-run/react";
import { useEffect, useState } from "react";
import { Rnd } from "react-rnd";
import supabase from "utils/supabase";
import { SupabaseOutletContext } from "~/root";
import Spotify from "../components/spotify";
import {HypeRate} from "../components/hyperate";

export const loader = async ({ request, params, response }) => {
  const sup = supabase(request, response);
  const profileRes = await sup.from("profiles").select("*").eq("username", params.profile).single();

  const layoutsRes = await sup.from("layouts").select("*").eq("id", profileRes.data.id).single();
  const postsRes = await sup.from("vw_posts_with_user").select("*").eq("user_id", profileRes.data.id);

  return { profile: profileRes.data, layoutData: layoutsRes.data, posts: postsRes.data };
};

export default function Profile() {
  const { profile, layoutData, posts } = useLoaderData();
  const { supabase } = useOutletContext<SupabaseOutletContext>();
  const [user, setUser] = useState(null);

  const [positions, setPositions] = useState(layoutData || {});

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    fetchUser();
  }, [supabase]);

  useEffect(() => {
    if (layoutData) {
      setPositions(layoutData);
    }
  }, [layoutData]);

  const saveLayoutData = async (updatedPositions) => {
    try {
      if (user?.id === profile.id) {
        await supabase
          .from("layouts")
          .upsert({ id: profile.id, ...updatedPositions }, { onConflict: 'id' });
        console.log("Layout data updated successfully!");
      }
    } catch (error) {
      console.error("Error saving layout data:", error.message);
    }
  };

  useEffect(() => {
    if (Object.keys(positions).length > 0) {
      saveLayoutData(positions);
    }
  }, [positions, profile.id, user]);

  const handleDragStop = (id, e, d) => {
    const updatedPositions = {
      ...positions,
      [id]: {
        ...positions[id],
        x: d.x,
        y: d.y,
      }
    };
    setPositions(updatedPositions);
  };

  const handleResizeStop = (id, e, direction, ref, delta, position) => {
    const updatedPositions = {
      ...positions,
      [id]: {
        ...positions[id],
        width: ref.style.width,
        height: ref.style.height,
        x: position.x,
        y: position.y,
      }
    };
    setPositions(updatedPositions);
  };

  const style = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "20px",
    background: "#121212",
  };

  if (!user) {
    return <p>Please log in to view this page.</p>;
  }

  return (
    <>
      <Rnd
        style={style}
        size={{ width: positions.profile?.width || 200, height: positions.profile?.height || 200 }}
        position={{ x: positions.profile?.x || 0, y: positions.profile?.y || 0 }}
        onDragStop={(e, d) => handleDragStop("profile", e, d)}
        onResizeStop={(e, direction, ref, delta, position) => handleResizeStop('profile', e, direction, ref, delta, position)}
        id="profile"
        resizable
      >
        <div>
          <div>
            <div>
              <div
                style={{ backgroundImage: `url(${profile?.background_url})`, backdropFilter: "blur(4px)" }}
              >
                <div className="center avatarcont">
                  <img className="avatar" src={`https://pwchtpxjolxhjfamtxrb.supabase.co/storage/v1/object/public/uploads/public/avatars/${user.id}`} alt="Avatar" />
                </div>
                <div className="info mt-4 center">
                  <h1 className="username">
                    {profile?.displayname ? profile.displayname : profile?.username}{" "}
                  </h1>
                  <p className="bio">{profile?.bio}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Rnd>

      <Rnd
        position={{ x: positions.posts?.x || 0, y: positions.posts?.y || 0 }}
        onDragStop={(e, d) => handleDragStop('posts', e, d)}
        onResizeStop={(e, direction, ref, delta, position) => handleResizeStop('posts', e, direction, ref, delta, position)}
        id="posts"
        resizable
      >
        {/* Posts content */}
        {/* <HypeRate hypeRateID={profile.heartbeat}/> */}
          
          {profile.heartbeat && <HypeRate hypeRateID={profile.heartbeat}/>}
      </Rnd>
    </>
  );
}
