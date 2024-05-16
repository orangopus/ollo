import { useLoaderData, useOutletContext } from "@remix-run/react";
import { useEffect, useState } from "react";
import { Rnd } from "react-rnd";
import supabase from "utils/supabase";
import { SupabaseOutletContext } from "~/root";

export const loader = async ({ request, params, response }: { request: any, params: any, response: any }) => {
  const sup = supabase(request, response);
  const profileRes = await sup.from("profiles").select("*").eq("username", params.profile).single();

  if (!profileRes.data || !profileRes.data.id) {
    throw new Error("Profile data or profile ID is undefined");
  }

  const layoutsRes = await sup.from("layouts").select("*").eq("id", profileRes.data.id).single();
  const postsRes = await sup.from("vw_posts_with_user").select("*").eq("user_id", profileRes.data.id);

  return { profile: profileRes.data, layoutData: layoutsRes.data, posts: postsRes.data };
};

export default function Profile() {
  const { profile, layoutData, posts } = useLoaderData();
  const { supabase } = useOutletContext<SupabaseOutletContext>();
  const user = supabase.auth.getUser();

  const [positions, setPositions] = useState(layoutData || {}); // Initialize with layout data if available

  useEffect(() => {
    if (layoutData) {
      setPositions(layoutData);
    }
  }, [layoutData]);

  useEffect(() => {
    const saveLayoutData = async () => {
      try {
        const currentUser = await user;
        if (currentUser?.data.user.id === profile.id) {
          if (Object.keys(positions).length > 0) {
            await supabase
              .from("layouts")
              .update({ ...positions }, { onConflict: ["id"], ignoreDuplicates: true })
              .eq("id", profile.id);
            console.log("Layout data updated successfully!");
          } else {
            await supabase.from("layouts").insert({ ...positions });
            console.log("New layout data saved successfully!");
          }
        }
      } catch (error) {
        console.error("Error saving layout data:", error.message);
      }
    };

    if (user && Object.keys(positions).length > 0) {
      saveLayoutData();
    }
  }, [positions, profile.id, user, supabase]);

  const handleDrag = (id, e, d) => {
    setPositions(prevPositions => ({
      ...prevPositions,
      [id]: { x: d.x, y: d.y, width: d.width, height: d.height }
    }));
  };

  const handleResize = (id, direction, ref, delta, position) => {
    setPositions(prevPositions => ({
      ...prevPositions,
      [id]: {
        ...(prevPositions[id] || {}),
        width: ref.offsetWidth,
        height: ref.offsetHeight
      }
    }));
  };

  const style = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "20px",
    background: "#121212",
  } as const;

  if (!user) {
    return <p>Please log in to view this page.</p>;
  }

  return (
    <>
      <Rnd
        style={style}
        size={{ width: positions.profile?.width || 200, height: positions.profile?.height || 200 }}
        position={{ x: positions.profile?.x || 0, y: positions.profile?.y || 0 }}
        onDrag={(e, d) => handleDrag("profile", e, d)}
        onResize={(e, direction, ref, delta, position) => handleResize('profile', direction, ref, delta, position)}
        id="profile"
        resizable
      >
        <div className="">
          <div className="">
            <div className="">
              <div
                className=""
                style={{ backgroundImage: `url(${profile?.background_url})`, backdropFilter: "blur(4px)" }}
              >
                <div className="center avatarcont">
                  <img
                    className="avatar"
                    src={profile?.avatar}
                  />
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
        onDrag={(e, d) => handleDrag('posts', e, d)} // Pass 'posts' as id
        onResize={(e, direction, ref, delta, position) => handleResize('posts', direction, ref, delta, position)} // Pass 'posts' as id
        id="posts"
        resizable
      >
        {/* Posts content */}
      </Rnd>
    </>
  );
}