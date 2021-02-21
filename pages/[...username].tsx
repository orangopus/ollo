import Head from "next/head";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { supabase } from '../utils/initSupabase';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import Markdown from "react-markdown";
import Link from "next/link"

dayjs.extend(relativeTime)
library.add(fab, fas)

export default function UserPage({ profile, posts }) {

  let twitter = profile.twitter 

  if (profile.html === null) {
    profile.html = profile.username + " hasn't set up their about section yet."
  }

  if (twitter === null) {
    twitter = null 
  } else if (twitter) {
    twitter = (
      <a href={`https://twitter.com/${profile.twitter}`} target="_blank" className="social twitter">
                      <FontAwesomeIcon icon={["fab", "twitter"]} />
            </a>
          )
  }

  let makerlog = profile.makerlog

  if (makerlog === null) {
    makerlog = null 
  } else if (makerlog) {
    makerlog = (
      <a href={`https://maker.to/${profile.makerlog}`} target="_blank" className="social makerlog">
      <FontAwesomeIcon icon={["fas", "check-circle"]} />
      </a>
          )
  }

  const formatDate = (date: string) => {
    return dayjs().to(dayjs(date))
  } 

  let proChecker = profile.pro

  if (proChecker === true) {
    proChecker = (
      <>
      <Link href="/pro">
      <span className="pro">PRO</span>
      </Link>
      </>
    )
  }

  let staffChecker = profile.staff

  if (staffChecker === true) {
    staffChecker = (
      <>
      <span className="staff">STAFF</span>
      </>
    )
  }

  let verifiedChecker = profile.verified

  if (verifiedChecker === true || profile.twitter) {
    verifiedChecker = (
      <>
      <span className="verified"><FontAwesomeIcon icon={["fas", "check"]} /></span>
      </>
    )
  }


  return (
    <>
      <Head>
      <title>{profile.username} | libby</title>
      <link rel="icon" type="image/png" href={profile.avatar}></link>
      <meta property="title" content={`${profile.username}'s Profile | libby`} />
      <meta property="description" content={`${profile.bio}`} />
      <meta property="url" content={`${window.location.host}/${profile.username}`} />
      <meta property="image" content={`${profile.avatar}`} />
      <script type="application/javascript" src="https://platform.twitter.com/widgets.js"></script>  
      </Head>
      <div className="herocont padd userdetails">
      <div className="flex">
      <div className="avatarcont">
      <img className="avatar" src={profile.avatar} />
      </div>
      <div className="info">
      <h1 className="username">{profile.displayname ? profile.displayname : profile.username} <span className="handle">@{profile.username}</span> {staffChecker} {verifiedChecker} {proChecker} </h1>
      <p></p>
      <p className="bio">{profile.bio}</p>
      </div>
      </div>   
      <Tabs>
      <div className="flexsocial">
      <div>
           <TabList>
      <Tab>About</Tab>
      <Tab>Posts</Tab>
      <Tab>Schedule</Tab>
      <Tab>Donate</Tab>
    </TabList> 
      </div>
      <div className="social">
      <div>
      {twitter}
      {makerlog}
      </div>
      </div>
      </div>
    <TabPanel>
    <div className="cards auto width">
    <div dangerouslySetInnerHTML={{ __html: "<p>" + profile.html + "</p>" }} />
    </div>
    </TabPanel>
    <TabPanel>
      <div className="posts">
    {posts.data.map((post, index) => (
        <div className="cards">
      <div className="flex">
      <div className="avatarcont">
      <a href={`/${post.username}`}>
      <img className="avatar avatar2" src={post.avatar} />
      </a>
      </div>
      <div className="info">
      <h1 className="username2">{post.displayname ? post.displayname : post.username} <span className="handle">@{post.username}</span><span className="minutesago">{ formatDate(post.published_at)}</span></h1>

      <p className="postcontent"><Markdown children={post.content} /></p>     
        </div>   
        </div>  
        </div>
      ))}    
      </div>
    </TabPanel>
    <TabPanel>
    <div className="cards auto">
      <p>Schedule isn't available in this early alpha.</p>
      </div>
    </TabPanel>
    <TabPanel>
    <div className="cards auto">
      <p>Donate isn't available in this early alpha.</p>
      </div>
    </TabPanel>
  </Tabs>
      </div>
    </>
  );
}

export async function getServerSideProps(context) {

  const { body, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", context.params.username)
    .single();

    const posts = await supabase
    .from("vw_posts_with_user")
    .select()
    .eq("username", context.params.username)

  if (!body) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      profile: body,
      posts: posts
    }, // will be passed to the page component as props
  };
}