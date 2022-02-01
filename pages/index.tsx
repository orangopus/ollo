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

export default function Index({ profile }) {

  var randomWord = ["one little library", "one little link", "open library"]

  const [pageData, setPageData] = useState<string | null>();

  useEffect(() => {
    getPageData().then((res) => {
      setPageData(res);
    });
  }, []);

  if (typeof pageData === 'undefined') {
    return <p>Loading...</p>;
  }

  var words = randomWord[Math.floor(Math.random() * randomWord.length)];

  if (pageData === null) {
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
                        className="flex items-center rounded rounded-r-none border-0 px-3 ml-3 font-bold text-white-100"><img src="logo.svg" className="small"/> </span>
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
          <div className="row padd">
            <div className="container text-center">
              <h1 className="h1">it's your ollo.fyi/<span className="organised">customised.</span></h1>
              <p className="text padding text-center">
                Choose one of our domains or use a custom domain of your own.
              </p>
              {profile
                .filter((n) => n.username)
                .sort(() => Math.random() - Math.random())
                .slice(0, 5)
                .map((profile) => (
                  <div className="cards domains inline-flex">
                      <img
                      data-tip
                      data-for={profile.username}
                      className="center avatar-hp"
                      src={profile.avatar ? profile.avatar : "avatar.png"}
                    />
                    <a
                      className="none"
                      href={`https://ollo.fyi/${profile.username ? profile.username : ""
                        }`}
                    >
                      ollo.fyi/{profile.username}
                    </a>
                  </div>
                ))}{" "}
                <br/>
              {profile
                .filter((n) => n.username)
                .sort(() => Math.random() - Math.random())
                .slice(0, 1)
                .map((profile) => (
                  <div className="cards domains">
                    <a
                      className="none"
                      href={`https://ollo.oo/${profile.username ? profile.username : ""
                        }`}
                    >
                      <span className="category">HNS</span> ollo.oo/{profile.username} <span className="live">COMING SOON</span>
                    </a>
                  </div>
                ))}{" "}
              <span className="cards domains">
                <a className="none">
                  yourdomain.com <span className="live">COMING SOON</span>
                </a>
              </span>
            </div>
          </div>
          <div></div>
        </div>
      </div>
    );
  }



  return (
    <div className="mx-5 my-8 text-3xl">
      <p>
        {pageData}
      </p>
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
