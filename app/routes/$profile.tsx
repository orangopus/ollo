import { useLoaderData, useOutletContext } from "@remix-run/react";
import Draggable from "react-draggable";
import { useEffect, useState } from "react";
import supabase from "utils/supabase";
import { SupabaseOutletContext } from "~/root";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import Markdown from "react-markdown";
import gfm from "remark-gfm";


export const loader = async ({ request, params, response }) => {
  const sup = supabase(request, response);
  const profileRes = await sup.from("profiles").select("*").eq("username", params.profile).single();
  const layoutsRes = await sup.from("layouts").select("*").eq("id", profileRes.data.id);
  const postsRes = await sup.from("vw_posts_with_user").select("*").eq("user_id", profileRes.data.id);

  if (profileRes.error || layoutsRes.error || postsRes.error) {
    throw new Error(profileRes.error?.message || layoutsRes.error?.message || postsRes.error?.message);
  }

  return { profile: profileRes.data, layoutData: layoutsRes.data, posts: postsRes.data };
};

export default function Profile() {
  const { profile, layoutData, posts } = useLoaderData();
  const { supabase } = useOutletContext<SupabaseOutletContext>();

  const [positions, setPositions] = useState([]);

  useEffect(() => {
    const fetchLayoutData = async () => {
      try {
        // Fetch layout data from Supabase
        const { data, error } = await supabase
          .from("layouts")
          .select("*")
          .eq("id", profile.id)
          .single();

        if (error) {
          throw error;
        }

        // If layout data exists, update the position
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
        // If layout data for the profile ID exists, update it; otherwise, create new layout data
        if (layoutData) {
          await supabase.from("layouts").update({ ...layoutData[0], ...positions }, { onConflict: ["id"], ignoreDuplicates: true }).eq("id", profile.id);
          console.log("Layout data updated successfully!");
        } else {
          await supabase.from("layouts").insert({ ...positions });
          console.log("New layout data saved successfully!");
        }
      } catch (error) {
        console.error("Error saving layout data:", error.message);
      }
    };

    // Call saveLayoutData function when position changes
    if (positions) {
      saveLayoutData();
    }
  }, [positions, layoutData, supabase]);

  const handleDrag = (component, e, ui) => {
    setPositions(prevPositions => ({
      ...prevPositions,
      [component]: { x: ui.x, y: ui.y }
    }));
  }

  return (
    <>
      <Draggable position={positions.profile} onDrag={(e, ui) => handleDrag('profile', e, ui)}>
        <div className="herocont padd mb-10 mt-10 userdetails">
          <div className="flex grid grid-cols-4">
            <div className="block mr-5">
              <div
                className="justify-center profilecont"
                style={{ backgroundImage: `url(${profile.background_url})`, backdropFilter: "blur(4px)" }}
              >
                <div className="center avatarcont">
                  <img
                    className="avatar"
                    src={profile.avatar}
                  />
                </div>
                <div className="info mt-4 center">
                  <h1 className="username">
                    {profile.displayname ? profile.displayname : profile.username}{" "}
                  </h1>
                  <p className="bio">{profile.bio}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Draggable>

      <Draggable position={positions.posts} onDrag={(e, ui) => handleDrag('posts', e, ui)}>
        <Tabs className="col-span-3">
              <TabList className="react-tabs inline-flex">             
                <Tab>Posts</Tab>
                <Tab>About</Tab>
              </TabList>
              <TabPanel>
                <div className="posts">
                  {posts.map((post, index) => (
                    <div className="cards cardspost" key={post.id}>
                      <div className="flex">
                        <div className="avatarcont">
                          <a href={`/${post.username}`}>
                            <img className="avatar avatar2" src={post.avatar} alt={post.username} />
                          </a>
                        </div>
                        <div className="info ml-4">
                          <h1 className="username mb-2 left">
                            {post.displayname ? post.displayname : post.username}{" "}
                            <span className="handle">@{post.username}</span>
                            <br />
                            <a className="minutesago" href={`/posts/${post.id}`}>
                              {post.published_at}
                            </a>
                          </h1>
                        </div>
                      </div>
                      <br />
                      <p className="postcontent">
                        <Markdown remarkPlugins={[gfm]} children={post.content} />
                      </p>
                      <div></div>
                    </div>
                  ))}
                </div>
              </TabPanel>
              <TabPanel>
                <div className="cards col-span-3">
                  <Markdown
                    plugins={[gfm]}
                    children={profile.html}
                    allowDangerousHtml={true}
                  />
                  <div>
                  </div>
                </div>
              </TabPanel>
            </Tabs>
      </Draggable>

      <Draggable position={positions.socials} onDrag={(e, ui) => handleDrag('socials', e, ui)}>
        <div className="socials">Socials</div>
      </Draggable>
    </>
  );
}