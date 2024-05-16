import { useLoaderData, useOutletContext } from "@remix-run/react";
import { useEffect, useState } from "react";
import {Rnd} from "react-rnd";
import supabase from "utils/supabase";
import { SupabaseOutletContext } from "~/root";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import Markdown from "react-markdown";
import gfm from "remark-gfm";

export const loader = async ({ request, params, response }: { request: any, params: any, response: any }) => {
  const sup = supabase(request, response); // Pass the required arguments to the supabase function call
  const profileRes = await sup.from("profiles").select("*").eq("username", params.profile).single(); // Add .single() to get a single result
  const postsRes = await sup.from("vw_posts_with_user").select("*").eq("user_id", profileRes.data?.id) // Add null check

  if (!profileRes.data || !profileRes.data.id) {
    throw new Error("Profile data or profile ID is undefined");
  }
  
  const layoutsRes = await sup.from("layouts").select("*").eq("id", profileRes.data.id)

  return { profile: profileRes.data, layoutData: layoutsRes.data, posts: postsRes.data };
};

export default function Profile() {
  const { profile, layoutData, posts } = useLoaderData();
  const { supabase } = useOutletContext<SupabaseOutletContext>();

  const [positions, setPositions] = useState({});

  useEffect(() => {
    const fetchLayoutData = async () => {
      try {
        const { data, error } = await supabase
          .from("layouts")
          .select("*")
          .eq("id", profile.id)
          .single();

        if (error) {
          throw error;
        }

        if (data) {
          setPositions(data);
        }
      } catch (error) {
        console.error("Error fetching layout data:", error.message);
      }
    };

    fetchLayoutData();
  }, [profile.id]);

  useEffect(() => {
    const saveLayoutData = async () => {
      try {
        if (layoutData) {
          await supabase
            .from("layouts")
            .update({ ...positions }, { onConflict: ["id"], ignoreDuplicates: true })
            .eq("id", profile.id);
          console.log("Layout data updated successfully!");
        } else {
          // Ensure profile.id is defined before attempting to insert data
          if (profile.id) {
            await supabase.from("layouts").insert({ ...positions });
            console.log("New layout data saved successfully!");
          }
        }
      } catch (error) {
        console.error("Error saving layout data:", error.message);
      }
    };

    if (positions) {
      saveLayoutData();
    }
  }, [positions, layoutData, profile.id, supabase]);

  const handleDrag = (id, e, d) => {
    setPositions(prevPositions => ({
      ...prevPositions,
      [id]: { x: d.x, y: d.y }
    }));
  };

  const handleResize = (id, direction, ref, delta, position) => {
    setPositions(prevPositions => ({
      ...prevPositions,
      [id]: {
        ...(prevPositions[id] as any),
        width: ref.offsetWidth,
        height: ref.offsetHeight
      }
    }));
  };

  const style = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "solid 1px #ddd",
    background: "#f0f0f0",
  } as const;

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