import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { supabase } from "../utils/initSupabase";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Markdown from "react-markdown";
import gfm from "remark-gfm";
import Link from "next/link";
import Head from "next/head";
import ImageFallback from "react-image-fallback";

dayjs.extend(relativeTime);
library.add(fab, fas);

export default function UserPage({ posts, user, profiles }) {
  const [post, setPost] = useState(posts.content);
  const session = supabase.auth.session();
  const [profile, setProfile] = useState([]);

  const router = useRouter();
  // Call this function whenever you want to
  // refresh props!
  const refreshData = () => {
    router.replace(router.asPath);
  };

  useEffect(() => {
    async function fetchProfile() {
      if (user) {
        const { body, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();

        setProfile(body.avatar);
      }
    }

    fetchProfile();

    // subscription
    supabase
      .from("posts")
      .on("*", (_payload) => {
        refreshData();
      })
      .subscribe();
  }, []);

  const createPost = async (event) => {
    event.preventDefault();
    await supabase.from("posts").insert([{ content: post, user_id: user.id }]);
    setPost("");
  };

  const deletePost = async (postID) => {
    await supabase
      .from("posts")
      .delete()
      .match({ id: `${postID}` });
  };

  const formatDate = (date: string) => {
    return dayjs().to(dayjs(date));
  };

  return (
    <>
      <Head>
        <title>Feed | Libby</title>
      </Head>
      <div>
        <div className="herocont padd2 postsfeed">
          <div>
            <div></div>
            <div className="feed">
              {user && (
                <div className="cards flex">
                  <img className="avatar" src={`${profile}`} />
                  <form className="postcontainer" onSubmit={createPost}>
                    <div className="postcontainer">
                      <textarea
                        id="clearPost"
                        name="bio"
                        value={post}
                        onChange={(event) => setPost(event.target.value)}
                        placeholder="What have you done today?"
                        className="textarea postinput"
                      />
                      <button className="button postsubmit" type="submit">
                        Post
                      </button>
                      <p className="postmarkdown">
                        <FontAwesomeIcon icon={["fab", "markdown"]} /> is
                        supported
                      </p>
                    </div>
                  </form>
                </div>
              )}
              {user === null && (
                <Link href="/dashboard">
                  <div className="created2">
                    <div className="cards created">
                      <div className="create">
                        <h1 className="createTitle text-4xl">
                          Create posts, edit your profile and do more...
                        </h1>
                        <p className="createText text-2xl p-1">
                          Create an account or login to make a post!
                        </p>
                        <button className="button">Get started</button>
                      </div>
                      <div className="inline2">
                        {profiles.data
                          .filter((n) => n.username)
                          .sort(() => Math.random() - Math.random())
                          .slice(0, 30)
                          .map((profile) => (
                            <div className="item">
                              <a
                                className="profileavatar"
                                href={`/${
                                  profile.username ? profile.username : ""
                                }`}
                              >
                                <ImageFallback
                                  data-tip
                                  data-for={profile.username}
                                  className="avatar avatar3"
                                  fallbackImage="avatar.png"
                                  src={profile.avatar}
                                />
                              </a>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </Link>
              )}
              {posts.data.map((post, index) => (
                <div className="cards postcard">
                  <div className="flex">
                    <div className="avatarcont ml-0 mr-0">
                      <a href={`/${post.username}`}>
                        <ImageFallback
                          data-tip
                          data-for={post.username}
                          className="avatar avatar2"
                          fallbackImage="avatar.png"
                          src={post.avatar}
                        />
                      </a>
                    </div>
                    <div className="info ml-4">
                      <h1 className="username mb-2 left">
                        {post.displayname ? post.displayname : post.username}{" "}
                        <span className="handle">@{post.username}</span>
                        <span className="minutesago">
                          {formatDate(post.published_at)}
                        </span>
                      </h1>

                      <p className="postcontent">
                        <Markdown plugins={[gfm]} children={post.content} />
                      </p>
                    </div>
                  </div>
                  <div>
                    {post.user_id === user.id ? (
                      <>
                        <button
                          onClick={() => deletePost(post.id)}
                          className="bg-red-500 text-gray-200 rounded hover:bg-red-400 px-6 py-2 focus:outline-none mx-1"
                        >
                          DELETE
                        </button>
                      </>
                    ) : (
                      <p></p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export async function getServerSideProps({ req }) {
  const { user } = await supabase.auth.api.getUserByCookie(req);

  const profiles = await supabase.from("profiles").select("*");

  const posts = await supabase.from("vw_posts_with_user").select();

  return {
    props: {
      profiles: profiles,
      user: user,
      posts: posts,
    },
  };
}
