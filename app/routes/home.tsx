import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { Form, useLoaderData } from "@remix-run/react";
import { ActionFunction, LoaderFunction, json } from "@remix-run/node";
import { User } from "@supabase/supabase-js";
import { Tables } from "database.types";
import { FormEventHandler, useState } from "react";
import EdiText from "react-editext";
import Markdown from "react-markdown";
import { useOutletContext } from "@remix-run/react";
import { toRelativeTimeString, toRelativeUserDateTimeString } from "utils/datetime";
import createServerSupabase from "utils/supabase.server";
import { SupabaseOutletContext } from "~/root";
import Like from "~/components/like";
import { Tooltip } from 'react-tooltip';

library.add(fab, fas);

export const action: ActionFunction = async ({ request, response }) => {
  try {
    const supabase = createServerSupabase({ request, response: response as Response });
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("User not authenticated");
    }

    const formData = new URLSearchParams(await request.text());
    const post = formData.get("post");

    if (post) {
      await supabase.from("posts").insert({ content: post, user_id: user.id });
    }

    return json(null, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return json({ error: error.message }, { status: 500 });
    }

    return json({ error }, { status: 500 });
  }
};

export const loader: LoaderFunction = async ({ request }) => {
  const response = new Response();
  const supabase = createServerSupabase({ request, response });

  const posts = await supabase.from("posts_with_likes").select().order("id", { ascending: false });
  const likes = await supabase.from("likes").select();
  const replies = await supabase.from("replies").select("*").order("id", { ascending: true });
  const { data: { user } } = await supabase.auth.getUser();
  const profiles = await supabase.from("profiles").select();

  return {
    posts: posts.data,
    user,
    likes: likes.data,
    replies: replies.data || [],
    profiles: profiles.data,
  };
};

export default function UserPage() {
  const { supabase } = useOutletContext<SupabaseOutletContext>();
  const { user, posts, likes, replies, profiles } = useLoaderData<{
    user: User,
    posts: Array<Tables<"posts_with_likes">>,
    likes: Array<Tables<"likes">>,
    replies: Array<Tables<"replies">>,
    profiles: Array<Tables<"profiles">>,
  }>();
  const [newPost, setNewPost] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [replyInputs, setReplyInputs] = useState<Record<Tables<"posts">["id"], boolean>>({});

  const handlePostSubmit = async (e: Event) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from('posts')
        .insert([{ content: newPost, user_id: user.id }]);

      if (error) {
        throw error;
      }

      setNewPost('');
      console.log('Post submitted successfully:', data);
    } catch (error) {
      if (error instanceof Error) {
        setError('Error submitting post: ' + error.message);        
      } else {
        setError('Error submitting post: ' + error);
      }

      console.error('Error submitting post:', error);
    }
  };

  const editPosts = async (content: string, postId: Tables<"posts">["id"]) => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .update({ content })
        .eq('id', postId);

      if (error) throw error;
      console.log('Post updated successfully:', data);
    } catch (error) {
      if (error instanceof Error) {
        setError('Error updating post: ' + error.message);        
      } else {
        setError('Error updating post: ' + error);
      }

      console.error('Error updating post:', error);
    }
  };

  const deletePost = async (postId: Tables<"posts">["id"]) => {
    try {
      const { data, error } = await supabase
        .from('replies')
        .delete()
        .eq('post_id', postId)
        .then(() =>
          supabase
            .from('posts')
            .delete()
            .eq('id', postId)
        );

      if (error) throw error;

      console.log('Post and its replies deleted successfully:', data);
    } catch (error) {
      if (error instanceof Error) {
        setError('Error deleting post: ' + error.message);        
      } else {
        setError('Error deleting post: ' + error);
      }

      console.error('Error deleting post:', error);
    }
  };

  const postReply = async (content: string, postId: Tables<"posts">["id"]) => {
    try {
      const { data, error } = await supabase
        .from('replies')
        .insert([{ content, post_id: postId, user_id: user.id }]);

      if (error) throw error;
      console.log('Reply submitted successfully:', data);
    } catch (error) {
      if (error instanceof Error) {
        setError('Error submitting reply: ' + error.message);        
      } else {
        setError('Error submitting reply: ' + error);
      }

      console.error('Error submitting reply:', error);
    }
  };

  const toggleReplyInput = (postId: Tables<"posts">["id"]) => {
    setReplyInputs((prev) => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  if (!user) {
    return <p className="text-white">You need to login to see this page.</p>;
  }

  return (
    <>
      {user && (
        <div className="cards flex">
          <img className="avatar" src={user.user_metadata.avatar_url} alt="User Avatar" />
          <Form className="postcontainer" method="post" onSubmit={handlePostSubmit as unkn as FormEventHandler<HTMLFormElement>}>
            <div className="postcontainer">
              <textarea
                id="clearPost"
                name="post"
                placeholder="What have you done today?"
                className="textarea postinput"
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
              />
              <button className="button postsubmit" type="submit">
                Post
              </button>
              <p className="postmarkdown">
                <FontAwesomeIcon icon={["fab", "markdown"]} /> is supported
              </p>
            </div>
          </Form>
          {error && <div className="error">{error}</div>}
        </div>
      )}

      {posts.map((post) => (
        <div className="cards postcard" key={post.id}>
          <div className="flex">
            <div className="avatarcont ml-0 mr-0">
              <a href={`/${post.username}`}>
                <img className="avatar avatar3" src={post.avatar || ""} alt={`${post.username} avatar`} />
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
                  {toRelativeUserDateTimeString(post.published_at!)}
                </a>
              </h1>
              <br />
            </div>
          </div>
          <p className="postcontent">
            {post.author_id === user.id ? (
              <EdiText
                key={post.id}
                value={post.content || ""}
                onSave={(value) => editPosts(value, post.id!)}
                submitOnEnter
                type="textarea"
                renderValue={(value) => <Markdown>{value}</Markdown>}
              />
            ) : (
              <Markdown>{post.content}</Markdown>
            )}
          </p>
          <div className="replies">
            {replies
              .filter((reply) => reply.post_id === post.id)
              .map((reply) => {
                const userProfile = profiles.find((profile) => profile.id === reply.user_id);
                if (!userProfile) return null;
                return (
                  <div key={reply.id} className="postcontent mb-4">
                    <img
                      data-tooltip-id="avatarTooltip" 
                      data-tooltip-content={userProfile.username}
                      className="avatar avatar3"
                      src={userProfile.avatar || ""}
                      alt={userProfile.username || ""}
                    />
                    <Tooltip id="avatarTooltip" />
                    <p className="reply-content mt-3">{reply.content}</p>
                    <p>
                      <span className="reply-author minutesago mt-3">
                        {toRelativeTimeString(reply.created_at!)}
                      </span>
                    </p>
                  </div>
                );
              })}
          </div>
          <div>
            <span className="minutesago mt-6 mr-3">
              <Like postId={post.id!} initialLikes={post.likes || 0} />
            </span>
            <button className="minutesago" onClick={() => toggleReplyInput(post.id!)}>
              reply
            </button>
          </div>
          {post.author_id === user.id && (
            <div>
              <button
                onClick={() => deletePost(post.id!)}
                className="bg-red-500 text-gray-200 minutesago"
              >
                delete
              </button>
            </div>
          )}
          {replyInputs[post.id!] && (
            <Form
              className="reply-form"
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                const replyContent = formData.get("reply");
                const trimmedReplyContent = (replyContent ?? "").toString().trim();

                if (trimmedReplyContent === "") {
                  return;
                }

                postReply(trimmedReplyContent!, post.id!);
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
          )}
        </div>
      ))}
    </>
  );
}
