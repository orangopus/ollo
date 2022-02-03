import Head from "next/head";
import Link from "next/link";
import { supabase } from "../utils/initSupabase";
import ReactTooltip from "react-tooltip";
import ImageFallback from "react-image-fallback";
import axios from "axios";
import { worker } from "cluster";
import { getPageData } from '../lib/getPageData';
import { useEffect, useState } from 'react';
import { get } from "https";
import SuperEllipse from "react-superellipse";
import { useMirror } from "react-mirror";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function Index({ profile }) {

  const [pane, setPane] = useState("ollo");

  return (
    <div>
      <Head>
        <title>ollo - one little link, organised.</title>
      </Head>
      <div className="herocont">
        <div className="row heropadding herobg">
          <div className="center">
            <p className="herotext text-center pt-5">one little link, <span className="organised">organised.</span></p>
            <p className="blurb padding text-center mt-5 mb-5">
              The free and open way to share your social library to the web.
            </p>

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
              </div>
            </div>
          </div>
        </div>

        <header className="center">
          <p className="minutesago">🪄 pro-tip: hover over the profiles to see them on the left.</p>
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
