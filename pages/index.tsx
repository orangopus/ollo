import Head from "next/head";
import Link from "next/link";
import { supabase } from "../utils/initSupabase";
import ReactTooltip from "react-tooltip";
import ImageFallback from "react-image-fallback";
import axios from "axios";

export default function Index({ profile }) {

  var randomWord = ["one little library", "one little link", "open library"]

  var words = randomWord[Math.floor(Math.random()*randomWord.length)];

  return (
    <div>
      <Head>
        <title>ollo - one little library, organised.</title>
      </Head>
      <div className="herocont">
        <div className="row heropadding herobg">
          <div className="center">
            <p className="herotext text-center pt-5">{words}, <span className="organised">organised.</span></p>
            <p className="blurb padding text-center mt-5 mb-5">
              Create, personalise your ollo and find your interests.
            </p>
            
            <br/>
            <div className="mt-5 mb-5">
            </div>
            <div className="jumc">
            <div className="jum-container slide-track">
            {profile
                .filter((n) => n.username)
                .sort((n) => Math.random() - Math.random())
                .map((profile) => (
                  <div className="mb-5 mr-10 jum-item slide">
                    <a
                      className="profileavatar"
                      href={`/${profile.username ? profile.username : ""}`}
                    >
                      <ImageFallback
                        data-tip
                        data-for={profile.username}
                        className="avatar small"
                        fallbackImage="avatar.png"
                        src={profile.avatar}
                      />
                    </a>
                  </div>
                ))}                              
            </div>
            <div className="jum-container slide-track-i">
            {profile
                .filter((n) => n.username)
                .sort((n) => Math.random() - Math.random())
                .map((profile) => (
                  <div className="mr-10 jum-item slide">
                    <a
                      className="profileavatar"
                      href={`/${profile.username ? profile.username : ""}`}
                    >
                      <ImageFallback
                        data-tip
                        data-for={profile.username}
                        className="avatar small"
                        fallbackImage="avatar.png"
                        src={profile.avatar}
                      />
                    </a>
                  </div>
                ))}                              
            </div>
            </div>
            <Link href="/dashboard">
              <button className="mt-16 button">GET STARTED</button>
            </Link>
            <div>
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
              .slice(0, 1)
              .map((profile) => (
                <div className="cards domains">
                  <a
                    className="none"
                    href={`https://ollo.fyi/${
                      profile.username ? profile.username : ""
                    }`}
                  >
                    ollo.fyi/{profile.username}
                  </a>
                </div>
              ))}{" "}
              {profile
              .filter((n) => n.username)
              .sort(() => Math.random() - Math.random())
              .slice(0, 1)
              .map((profile) => (
                <div className="cards domains">
                  <a
                    className="none"
                    href={`https://ollo.gg/${
                      profile.username ? profile.username : ""
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

export async function getServerSideProps() {
  const { body, error } = await supabase.from("profiles").select("*");

  if (!body) {
    return {
      notFound: true,
    };
  }
  return {
    props: {
      profile: body,
    }, // will be passed to the page component as props
  };
}
