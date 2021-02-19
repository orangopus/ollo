import Head from "next/head";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { supabase } from '../utils/initSupabase';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

library.add(fab, fas)

export default function UserPage({ profile }) {

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

  return (
    <>
      <Head>
      <title>{profile.username} | libby</title>
      <link rel="icon" type="image/png" href={profile.avatar}></link>
      <script type="application/javascript" src="https://platform.twitter.com/widgets.js"></script>  
      </Head>
      <div className="herocont padd userdetails">
      <div className="flex">
      <div className="avatarcont">
      <img className="avatar" src={profile.avatar} />
      </div>
      <div className="info">
      <h1 className="username">{profile.displayname ? profile.displayname : profile.username} <span className="handle">@{profile.username}</span></h1>
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
      <div className="cards auto">
      <p>Posts isn't available in this early alpha.</p>
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

  if (!body) {
    return {
      notFound: true,
    };
  }
  return {
    props: {
      profile: body
    }, // will be passed to the page component as props
  };
}


