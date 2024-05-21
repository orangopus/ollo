
import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import Markdown from "react-markdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SupabaseOutletContext } from "~/root";
import { useLoaderData, useOutletContext } from "@remix-run/react";
import supabase from "utils/supabase";

export const  loader = async ({ request, params, response }: LoaderFunctionArgs) => {
  const sup = supabase(request, response)
  const res = await sup
    .from("posts_with_likes")
    .select("*")
    .eq("id", params.id)
    .single();

    // do not handle like this, actually handle error
  if (res.error) {
    throw new Error(res.error.message)
  }
  return res.data;
};

export default function Post() {
  const post = useLoaderData();

  console.log(post)

  return (
    <>
      <title>{post.displayname ? post.displayname : post.username} on ollo: {post.content}</title>
      <div>
        <div className="cards grid mb-10 padding postcard" style={{ border: "4px solid rgba(0, 0, 0, 0.5)" }}>
          <div className="flex">
            <div className="avatarcont ml-0 mr-0">
              <a href={`/${post.username}`}>
                <img
                  data-tip
                  data-for={post.username}
                  className="avatar avatar2"
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
                <a className="minutesago">
                  {post.published_at}
                </a>
              </h1>
              <br />
            </div>
          </div>
          <p className="postcontent">
            {post.content}
          </p>
          <div className="mt-2">
                
            <span className="minutesago reply">
              reply 
            </span>
          </div>
        </div>
      </div>
    </>
  );
}