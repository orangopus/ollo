import Head from "next/head";
import { useState, useEffect } from "react";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { supabase } from "../../utils/initSupabase";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Link from "next/link";
import ImageFallback from "react-image-fallback";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Markdown from "react-markdown";
import gfm from "remark-gfm";

import EdiText from "react-editext";


dayjs.extend(relativeTime);
library.add(fab, fas);

import { useRouter } from "next/router";
import Router from "next/router";


export default function Embed({ posts,session }) {
  const router = useRouter();
  const { id } = router.query;
  
  const formatDate = (date: string) => {
    return dayjs().to(dayjs(date));
  };

  return (
    <>
        <Head>
              <title>{posts[0].displayname} on ollo: {posts[0].content}</title>
        </Head>
        <div className="container">
        <p>
        <a className="back" onClick={() => Router.back()}>go back</a>

        </p>
        {posts.map((post, index) => (

<div className="cards grid mb-10 padding postcard" style={{border: "4px solid rgba(0, 0, 0, 0.5)"}}>
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
        <span className="handle">{post.verified ? post.verified = (
          <span className="verify">
          <FontAwesomeIcon icon={["fas", "check"]} />
        </span>
        ) : null}</span>
        <span className="handle">@{post.username}</span>
        <br/>
        <a className="minutesago">
          {formatDate(post.published_at)}
        </a>
      </h1>
      <br/>
      </div>
    </div>
    <p className="postcontent">
            <Markdown plugins={[gfm]} children={post.content} />
      </p>
      <div className="mt-2">
      <span className="minutesago reply">
          reply
        </span>
        </div>
</div>
))}
        </div>
    </>
  );
}

export async function getServerSideProps({params}) {

  const {data, error} = await supabase
    .from("vw_posts_with_user")
    .select()
    .match({id: params?.id})


  if (!data) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      posts: data,
    }, // will be passed to the page component as props
  };
}
