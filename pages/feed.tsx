import { useState } from "react";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { supabase } from "../utils/initSupabase";
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import Link from "next/link";
import axios from "axios";

dayjs.extend(relativeTime)
library.add(fab, fas)

export default function UserPage({ profile, posts, user }) {
  const [post, setPost] = useState(posts.content);
  const router = useRouter();
  // Call this function whenever you want to
  // refresh props!
  const refreshData = () => {
    router.replace(router.asPath);
  }

  const createPost = async (event) => {
    event.preventDefault();
    await supabase
      .from("posts")
      .insert([
        { content: post,
          user_id: user.id
         }
      ])

      refreshData()
  };

  if(profile.html === null) {
    profile.html = "You haven't set an About section yet..."
  }

  const formatDate = (date: string) => {
    return dayjs().to(dayjs(date))
  } 

  return (
    <>
    <div>

    <div className="herocont padd2">
    <div className="cards">
    <form onSubmit={createPost}>
      <h1>Create Post</h1>
      <hr/>
      <textarea
        id="bio"
        name="bio"
        value={post}
        onChange={(event) => setPost(event.target.value)}
        placeholder="What have you done today?"
        className="textarea "
      />
      <div className="center">
        <button className="button" type="submit">Post</button>
      </div>
    </form>
    </div>
    </div>

    <div className="herocont padd2 userdetails">
      <div className="flex">
      <div>
      </div>
      <div className="info">
      {posts.data.map((post, index) => (
        <div className="cards">
      <div className="flex">
      <div className="avatarcont">
      <img className="avatar" src={post.avatar} />
      </div>
      <div className="info">
      <h1 className="username">{post.displayname ? post.displayname : post.username} <span className="handle">@{post.username}</span></h1>

      <p>{post.content}</p>    

      <p>{ formatDate(post.published_at)}</p>
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

  const { body, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const posts = await supabase
  .from("vw_posts_with_user")
  .select()

  console.log(posts)

  if (!body) {
    return {
      notFound: true,
    };
  }
  return {
    props: {
      profile: body,
      user: user,
      posts: posts
    },
  };
}