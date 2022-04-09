import Head from "next/head";
import Link from "next/link";
import { supabase } from "../utils/initSupabase";
import ImageFallback from "react-image-fallback";
import React from "react";
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import config from "../package.json"
import { read, readvSync } from "fs";
import * as THREE from "three";

export default function Index({ profile }) {

  const [pane, setPane] = useState("ollo");

  return (
    <div>
      <Head>
        <title>ollo - one little link, organised.</title>
      </Head>
      <div className="herocont">
        <div className="row heropadding pt-7 herobg">
          <div className="center">
            <p className="herotext text-center pt-5">open libraries, let's <span className="organised">open-everything.</span></p>
            <p className="blurb padding text-center mt-5 mb-5">
              The free and open way to share your library to the web.
              {MediaError}
            
            </p>
            {JSON.stringify(config)}
            <br />
            <div className="center">
              <div className="mx-auto center">
                <div className="usernameinput mx-auto h-500px w-300px flex flex-col px-2">
                  <div className="search-box">
                    <form className="flex">
                      <span
                        className="flex items-center rounded rounded-r-none border-0 px-3 ml-3 font-bold text-white-100"><img src="logo.svg" className="small" /> </span>
                      <input
                        className="h-16 text-grey-darker py-2 font-normal border-0 m-3 text-grey-darkest border border-gray-100 font-bold w-full py-1 px-2 outline-none text-lg text-gray-600"
                        type="text" placeholder="your username here" />
                      <Link href="/dashboard">
                        <button className="bg-white buttonwidth text-lg text-black font-bold py-3 m-3 rounded-full">GET STARTED</button>
                      </Link>
                      
                    </form>
                  
                  </div>

                  
                
                </div>
                
                <p className="mt-5 minutesago">Version: {config.version}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-card container dark p-5 gap-6 grid-cols-3 padd">

        <div className="grid-card hover dark p-5 center items-center">

          <img src="postintegrations.png"/>
          
          <h1 className="bold mt-4 mb-2">Socially Integrated</h1>
          <p className="">Spice up your life with library widgets intended to streamline your content.</p>
        </div>

        <div className="grid-card p-5 my-auto col-span-2">
        <img src="logo.svg" className="logo"/>
        <h1 className="bold mt-4 mb-2">Hi-5 creators</h1>
        <p>It wouldn't be a social platform without giving your favourite content creators a hi-5 whenever they write good content.</p>
        </div>

        <div className="grid-card p-5 items-center">
        <FontAwesomeIcon icon={["fas", "cubes"]} size="6x" className="homeicon"/>
          
          <h1 className="bold mt-4 mb-2">Building blocks</h1>
          <p>Create a free, dynamically generated profile. It works like magic.</p>
        </div>

        <div className="grid-card hover p-5 center bg-white items-center">
        <img src="https://www.paypalobjects.com/webstatic/mktg/Logo/pp-logo-200px.png" className="logo-block center"/>
        <h1 className="bold mt-4 mb-2 sub-black">0% Platform-fees</h1>
        <p className="sub-black">We integrate directly with PayPal's API and we do not take a cut.</p>
        </div>

        <div className="grid-card hover p-5 center black items-center">
          <div className="flex items-center">
          <img src="https://pipedream.com/s.v0/app_1dBhP3/logo/96" className="logo-block center"/>
          </div>

          <h1 className="bold mt-4 mb-2">Powered by lightning</h1>
          <p>The power of Supanext makes our platform very quick like Sonic.

        </p>
        </div>

        <div className="grid-card p-5 my-auto col-span-1 hover text-center heartwatch">            
          <img src="heartwatch.png" className="logo-block mt-4 mb-3 center"/>
        <p className="center">Streamer or scaredy cat? Integrate your watch's heartbeat into ollo.</p>

        </div>

        <div className="grid-card p-5 items-center col-span-2">      
        <div className="my-auto items-center">
        <img src="unlock.png" className="logo-block mt-4 mb-3"/>     
          <h1 className="bold mt-4 mb-2">No paywalls. 100% free.</h1>
          <p>We don't charge a penny for you to use the platform. If you feel the need to support the cause, you can contribute and get perks.
            We will never charge for features, only for the badge.
          </p>
        </div>  
        </div>

        <div className="grid grid-cols-5 col-span-3">

        <div className="grid-card p-5 items-center col-span-2 unlock">    
        <p><span className="soon">in testing</span></p>  
          <h1 className="bold mt-4 mb-2">Developer API</h1>
          <p>View our creator API and see just how powerful our platform can be.</p>
        </div>

        <div className="grid grid-cols-2 col-span-3">

        <div className="grid-card p-5 items-center">        
        <p><span className="soon">coming soon</span></p>  
          <h1 className="bold mt-4 mb-2">Portfolio</h1>
          <p>If life gives you uwu, make a magicawwy genewated powtfowio.</p>
        </div>
        <div className="grid-card p-5 items-center">   
        <p><span className="soon">coming soon</span></p>       
          <h1 className="bold mt-4 mb-2">Domains</h1>
          <p>Imagine having a platform that auto-generates domains for you.</p>
        </div>
        <div className="grid-card p-5 items-center">   
        <p><span className="soon">coming soon</span></p>       
          <h1 className="bold mt-4 mb-2">Commissions</h1>
          <p>Talk in a private room between you and the client. Negotiate a price, pay for it. Simples. No platform-charges.</p>

        </div>
        <div className="grid-card p-5 items-center">   
        <p><span className="soon">new</span></p>       
          <h1 className="bold mt-4 mb-2">Posts</h1>
          <p>Create content on your page which supports Markdown and Rich Embeds.</p>
        </div>


        </div>

        </div>

        </div>

        <header className="center">
          <p className="minutesago">&#129668; -pro-tip: hover over the profiles to see them on the left.</p>
          <p className="gridtitle text-center">
            Customise and add <span className="personality">personality</span> <span>to your ollo</span>
          </p>
        </header>

        <div className="grid grid-cols-4 gap-10 my-10 padd">
          {profile

            .filter(profile => profile.username === pane)
            .slice(0, 1)
            .map(profile => (
              <>
                
                  <div className="grid-card dark p-5" style={{ backgroundImage: `url(${profile.background_url})` }}
                  >
                    <div className="center avatarcont">
                      <ImageFallback
                        data-tip
                        data-for={profile.username}
                        className="avatar"
                        fallbackImage="avatar.png"
                        src={profile.avatar}
                      />
                    </div>
                    <div className="info mt-4 center">
                      <h1 className="username">
                        {profile.displayname ? profile.displayname : profile.username}{" "}
                        <div>
                          <span className="handle">@{profile.username}</span>
                        </div>
                      </h1>
                      <p className="bio">{profile.bio}</p>
                    </div>
                  </div>
              </>
            ))}

          <div className="grid-card postcontent col-span-3">

            {profile

              .filter((n) => n.username)
              .slice(0, 15)
              .map((profile) => (
                <div className="cards domains scroll inline-flex"
                  onMouseOver={() => { setPane(profile.username); }}
                  onMouseLeave={() => { setPane(profile.username); }}
                >

                  <ImageFallback
                    data-tip
                    data-for={profile.username}
                    className="center avatar-hp"
                    fallbackImage="../avatar.png"
                    src={profile.avatar ? profile.avatar : "../avatar.png"}
                  />
                  <a
                    className="none"
                    href={`/${profile.username ? profile.username : ""
                      }`}
                  >
                    {profile.username}
                  </a>
                </div>

              ))}
          </div>
        </div>
        <div className="grid grid-cols-4 gap-10 padd my-10">
        <div className="grid-card dark p-5 red">
          <p className="gridsub">
          <FontAwesomeIcon icon={["fas", "angry"]} size="6x" className="homeicon "/>
          <br/>
            Can't be evil
          </p>
          <p>Our ethos is simple. We're privacy-focused and don't share your data with third-parties.</p>
          </div>
          <div className="grid-card p-5 green">
          <p className="gridsub green">
          <FontAwesomeIcon icon={["fas", "leaf"]} size="6x" className="homeicon green"/>
          <br/>
            Eco-friendly
          </p>
          <p className="green">We're trying to help the environment, but also not destroy it with awful procedurally-generated NFTs.</p>
          </div>
          <div className="grid-card dark p-5">
          <p className="gridsub">

          <FontAwesomeIcon icon={["fab", "osi"]} size="6x" className="homeicon"/>
          <br/>
            Open-source
          </p>
          <p>Our source code is open, because we're powered by the Orangopus Initiative.</p>
          </div>
          <div className="grid-card dark p-5 black">
          <p className="gridsub">
          <FontAwesomeIcon icon={["fas", "terminal"]} size="6x" className="homeicon"/>
          <br/>
            Coded with ❤️
          </p>
          <p>Some code stuff here. Some command line there. It's hard work but crafted with love and joy.</p>
          </div>
        </div>


      </div>
    </div>
  );
}


export async function getServerSideProps() {
  const { body } = await supabase.from("profiles").select("*");

  // Pass data to the page via props

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
