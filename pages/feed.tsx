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

dayjs.extend(relativeTime);
library.add(fab, fas);

export default function UserPage({ posts, user }) {
  const [post, setPost] = useState(posts.content);

  const router = useRouter();
  // Call this function whenever you want to
  // refresh props!
  const refreshData = () => {
    router.replace(router.asPath);
  };

  useEffect(() => {
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
  };

  const formatDate = (date: string) => {
    return dayjs().to(dayjs(date));
  };

  return (
    <>
      <div>
        <div className="herocont padd2 postsfeed">
          <div>
            <div></div>
            <div className="feed">
              {user && (
                <div className="cards">
                  <form onSubmit={createPost}>
                    <hr />
                    <div className="postcontainer">
                      <textarea
                        id="clearPost"
                        name="bio"
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
              {posts.data.map((post, index) => (
                <div className="cards postcard">
                  <div className="flex">
                    <div className="avatarcont">
                      <a href={`/${post.username}`}>
                        <img className="avatar" src={post.avatar} />
                      </a>
                    </div>
                    <div className="info">
                      <h1 className="username">
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

  const posts = await supabase.from("vw_posts_with_user").select();

  return {
    props: {
      user: user,
      posts: posts,
    },
  };
}
