import { useState, useEffect, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { Form, useLoaderData } from "@remix-run/react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import EdiText from "react-editext";
import Markdown from "react-markdown";
import { json } from "@remix-run/node";
import { useOutletContext } from "@remix-run/react";
import createServerSupabase from "utils/supabase.server";
import { SupabaseOutletContext } from "~/root";
import Like from "~/components/like";

dayjs.extend(relativeTime);
library.add(fab, fas);

export const action = async ({ request }: ActionArgs) => {
  const response = new Response();
  const supabase = createServerSupabase({ request, response });
  const data = await supabase.auth.getUser();
  const formData = Object.fromEntries(await request.formData());

  if (!data.user) {
    throw new Error("User not authenticated");
  }

  if (formData.reply && formData.post_id) {
    const { reply, post_id } = formData;
    await supabase
      .from("replies")
      .insert({ content: reply, post_id, user_id: data.user.id });
  } else {
    const { post } = formData;
    await supabase
      .from("posts")
      .insert({ content: post, user_id: data.user.id });
  }

  return json(null, { headers: response.headers });
};

export const loader = async ({ request }: LoaderArgs) => {
  const response = new Response();
  const supabase = createServerSupabase({ request, response });

  const posts = await supabase
    .from("posts_with_likes")
    .select()
    .order("id", { ascending: false });

  const likes = await supabase.from("likes").select();

  const replies = await supabase
    .from("replies")
    .select("*")
    .order("id", { ascending: true });

  const dataType = await supabase.auth.getUser();

  const profile = await supabase.from("profiles").select();

  return {
    posts: posts.data,
    data: dataType.data,
    likes: likes.data,
    replies: replies.data || [],
    profile: profile.data,
  };
};

export default function UserPage() {
  const { supabase } = useOutletContext<SupabaseOutletContext>();
  const { posts, data, likes, replies, profile } = useLoaderData();

  const editPosts = async (edit, editID) => {
    await supabase
      .from("posts")
      .update({ content: edit })
      .eq("id", editID);
  };

  const deletePost = async (postID) => {
    await supabase
      .from("posts")
      .delete()
      .match({ id: postID });
  };

  const formatDate = (date) => dayjs().to(dayjs(date));

  const postReply = async (replyContent, postId) => {
    if (!data.user) {
      throw new Error("User not authenticated");
    }
    await supabase
      .from("replies")
      .insert({ content: replyContent, post_id: postId, user_id: data.user.id });

    // Refresh the page or data to show the new reply
    window.location.reload();
  };

  return (
    <>
      {data?.user && (
        <div className="cards flex">
          <img className="avatar" src={data.user.user_metadata.avatar_url} />
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
                <FontAwesomeIcon icon={["fab", "markdown"]} /> is supported
              </p>
            </div>
          </Form>
        </div>
      )}

      {posts.map((post) => (
        <div className="cards postcard" key={post.id}>
          <div className="flex">
            <div className="avatarcont ml-0 mr-0">
              <a href={`/${post.username}`}>
                <img className="avatar avatar3" src={post.avatar} />
              </a>
            </div>
            <div className="info ml-4">
              <h1 className="username mb-2 left">
                {post.displayname || post.username}{" "}
                <span className="handle">
                  {post.verified && (
                    <span className="verify">
                      <FontAwesomeIcon icon={["fas", "check"]} />
                    </span>
                  )}
                </span>
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
            {post.user_id === data.id ? (
              <EdiText
                key={post.id}
                value={post.content}
                onSave={(value) => editPosts(value, post.id)}
                submitOnEnter
                type="textarea"
                renderValue={(value) => <p>{post.content}</p>}
              />
            ) : (
              <Markdown>{post.content}</Markdown>
            )}
          </p>
          {/* Display replies */}
          <div className="replies">
          {replies
  .filter((reply) => reply.post_id === post.id)
  .map((reply) => {
    const userProfile = profile.find((profile) => profile.id === reply.user_id);
    if (!userProfile) return null; // Handle case where profile is not found
    return (
      <div key={reply.id} className="postcontent">
        <img
          className="avatar avatar3"
          src={userProfile.avatar}
          alt={userProfile.username}
        />
        <p>{reply.content}</p>
        <p>
        <span className="reply-author ">
          {userProfile.username} - {formatDate(reply.created_at)}
        </span>
        </p>
      </div>
    );
  })}

          </div>
          <div className="mt-2">
            <span className="minutesago">
              <Like postId={post.id} initialLikes={post.likes} />
            </span>
            <span className="minutesago reply">reply</span>
          </div>
          <div>
            <button
              onClick={() => deletePost(post.id)}
              className="bg-red-500 text-gray-200 minutesago"
            >
              delete
            </button>
          </div>

          {/* Reply form */}
          <Form
            className="reply-form"
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              const replyContent = formData.get("reply");
              postReply(replyContent, post.id);
            }}
          >
            <textarea
              name="reply"
              placeholder="Write a reply..."
              className="textarea reply-input"
            />
            <button type="submit" className="button reply-submit">
              Reply
            </button>
          </Form>
        </div>
      ))}
    </>
  );
}
