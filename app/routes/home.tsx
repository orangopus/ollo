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

const formatDate = (date) => dayjs().to(dayjs(date));

export const action: ActionFunction = async ({ request }) => {
  try {
    const supabase = createServerSupabase({ request });
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
    return json({ error: error.message }, { status: 500 });
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
  const { user, posts, likes, replies, profiles } = useLoaderData();
  const [newPost, setNewPost] = useState(""); // State to store new post content
  const [error, setError] = useState(null); // State to store error messages
  const [replyInputs, setReplyInputs] = useState({}); // State to manage visibility of reply inputs

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from('posts')
        .insert([{ content: newPost, user_id: user.id }]);

      if (error) {
        throw error;
      }

      setNewPost(''); // Clear the input field after submission
      console.log('Post submitted successfully:', data);
    } catch (error) {
      setError('Error submitting post: ' + error.message);
      console.error('Error submitting post:', error);
    }
  };

  const editPosts = async (content, postId) => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .update({ content })
        .eq('id', postId);

      if (error) throw error;
      console.log('Post updated successfully:', data);
    } catch (error) {
      setError('Error updating post: ' + error.message);
      console.error('Error updating post:', error);
    }
  };

  const deletePost = async (postId) => {
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
      setError('Error deleting post: ' + error.message);
      console.error('Error deleting post:', error);
    }
  };

  const postReply = async (content, postId) => {
    try {
      const { data, error } = await supabase
        .from('replies')
        .insert([{ content, post_id: postId, user_id: user.id }]);

      if (error) throw error;
      console.log('Reply submitted successfully:', data);
    } catch (error) {
      setError('Error submitting reply: ' + error.message);
      console.error('Error submitting reply:', error);
    }
  };

  const toggleReplyInput = (postId) => {
    setReplyInputs((prev) => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  if (!user) {
    return <p className="text-white">You need to login to see this page.</p>; // or handle unauthenticated state
  }

  return (
    <>
      {user && (
        <div className="cards flex">
          <img className="avatar" src={user.user_metadata.avatar_url} alt="User Avatar" />
          <Form className="postcontainer" method="post" onSubmit={handlePostSubmit}>
            <div className="postcontainer">
              <textarea
                id="clearPost"
                name="post"
                placeholder="What have you done today?"
                className="textarea postinput"
                value={newPost} // Bind the value of the textarea to the state
                onChange={(e) => setNewPost(e.target.value)} // Update the state on change
              />
              <button className="button postsubmit" type="submit">
                Post
              </button>
              <p className="postmarkdown">
                <FontAwesomeIcon icon={["fab", "markdown"]} /> is supported
              </p>
            </div>
          </Form>
          {error && <div className="error">{error}</div>} {/* Display error message */}
        </div>
      )}

      {posts.map((post) => (
        <div className="cards postcard" key={post.id}>
          <div className="flex">
            <div className="avatarcont ml-0 mr-0">
              <a href={`/${post.username}`}>
                <img className="avatar avatar3" src={post.avatar} alt={`${post.username} avatar`} />
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
            {post.user_id === user.id ? (
              <EdiText
                key={post.id}
                value={post.content}
                onSave={(value) => editPosts(value, post.id)}
                submitOnEnter
                type="textarea"
                renderValue={(value) => <Markdown>{value}</Markdown>}
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
                const userProfile = profiles.find((profile) => profile.id === reply.user_id);
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
            <button className="minutesago" onClick={() => toggleReplyInput(post.id)}>
              reply
            </button>
          </div>
          {post.user_id === user.id && (
            <div>
              <button
                onClick={() => deletePost(post.id)}
                className="bg-red-500 text-gray-200 minutesago"
              >
                delete
              </button>
            </div>
          )}
          {/* Reply form */}
          {replyInputs[post.id] && (
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
          )}
        </div>
      ))}
    </>
  );
}
