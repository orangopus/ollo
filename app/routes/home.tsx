import { useState, useEffect, useContext, JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { Form, Link, useLoaderData } from "@remix-run/react";
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime";
import EdiText from "react-editext";
import Markdown from "react-markdown";
import { useOutletContext } from "@remix-run/react";
import createServerSupabase from "utils/supabase.server";
import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node"; 
import postcss from "postcss";
import { SupabaseOutletContext } from "~/root";
import { UserContext } from "context/UserContext";
import Like from "~/components/like"

// beginning of code
dayjs.extend(relativeTime);
library.add(fab, fas);

// create a new post
export const action = async ({ request }: ActionArgs) => {
  const response = new Response();
  const supabase = createServerSupabase({ request, response });
  const data = await supabase.auth.getUser()
  const posts = await supabase.from("posts_with_likes").select()
  const { post } = Object.fromEntries(await request.formData());
  const { error } = await supabase
    .from("posts")
    .insert({ content: post, user_id: data.data.user.id});

  return json(null, { headers: response.headers });
};

// load posts from database
export const loader = async ({ request }: LoaderArgs) => {
  const response = new Response();
  const supabase = createServerSupabase({ request, response });

  const posts = await supabase.from("posts_with_likes").select().order('id', { ascending: false });
  const likes = await supabase.from("likes").select();

  const dataType = await supabase.auth.getUser()

  return {
    posts: posts,
    data: dataType.data,
    likes: likes,
    // replys: replys
  }
    
};

export default function UserPage() {
  const user = useContext(UserContext)
  const {supabase} = useOutletContext<SupabaseOutletContext>();
  const posts = useLoaderData()
  const data = useLoaderData()
  const likes = useLoaderData()
  const editPosts = async (edit, editID) => {
    await supabase
      .from("posts")
      .update({
        content: edit,
      })
      .eq("id", editID);
  };

  const refreshData = () => {
    redirect("/home")
  };


  useEffect(() => {
    async function fetchProfile() {
      if (user) {
        const { body, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();
      }
    }

    fetchProfile();

    // subscription
    
  }, []);

  const deletePost = async (postID: any) => {
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
              {data.data.user && (
              <div className="cards flex">
                <img className="avatar" src={`${posts.data.user.user_metadata.avatar_url}`} />
                <Form className="postcontainer" method="post">
                  <div className="postcontainer">
                    <textarea
                      id="clearPost"
                      name="post"
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
                </Form>
              </div>
            )}

           {posts.posts.data.map((post, index)=> (
              <div className="cards postcard" key={post.id}>
                <div className="flex">
                  <div className="avatarcont ml-0 mr-0">
                    <a href={`/${post.username}`}>
                      <img
                      className="avatar avatar3"
                        src={post.avatar}
                      />
                    </a>
                  </div>
                  <div className="info ml-4">
                    <h1 className="username mb-2 left">
                      {post.displayname ? post.displayname : post.username}{" "}
                      <span className="handle">{post.verified ? post.verified = (
                        <span className="verify">
                          <FontAwesomeIcon icon={["fas", "check"]} />
                        </span>
                      ) : null}</span>
                      <span className="handle">@{post.username}</span>
                      <br />
                      <a className="minutesago" href={`posts/${post.id}`}>
                        {formatDate(post.published_at)}
                      </a>
                    </h1>
                    <br />
                  </div>
                </div>
                <p className="postcontent">
                  {
                    (post.id === post.user_id ? (
                      <>
                        <EdiText
                          key={post.id}
                          value={post.content}
                          onSave={(value) => editPosts(value, post.id)}
                          submitOnEnter
                          type="textarea"
                          renderValue={(value) => {
                            return (
                              <p>{post.content}</p>
                              
                            );
                          }}
                        />
                      </>
                    ) : (
                      <Markdown children={post.content} />
                    ))}

                </p>
                <div className="mt-2">
                <span className="minutesago"><Like postId={post.id} initialLikes={post.likes}/></span>
                  
                <span className="minutesago reply">
                    reply
                  </span>
                </div>
                <div>
                      <>
                        <button
                          onClick={() => deletePost(post.id)}
                          className="bg-red-500 text-gray-200 minutesago"
                        >
                          delete
                        </button>
                      </>
                </div>
              </div>
            ))} 
    </>
  );
}

