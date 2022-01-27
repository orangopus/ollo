import Head from "next/head";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { supabase } from "../utils/initSupabase";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Markdown from "react-markdown";
import Link from "next/link";
import gfm from "remark-gfm";
import ReactTooltip from "react-tooltip";
import { TwitterTimelineEmbed } from "react-twitter-embed";
import { url } from "inspector";
import axios from "axios";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import React from "react";
import ImageFallback from "react-image-fallback";
import { HeaderController } from "../utils/HeaderController";

dayjs.extend(relativeTime);
library.add(fab, fas);

export default function UserPage({ profile, user, posts, wildcard }) {
  if (profile.html === null) {
    profile.html = "";
  }

  const session = supabase.auth.session();

  const [glimeshHTML, setGlimeshHTML] = useState([]);
  const [glimeshTitle, setGlimeshTitle] = useState([]);
  const [glimeshCat, setGlimeshCat] = useState([]);
  const [glimeshTags, setGlimeshTags] = useState([]);
  const [glimeshThumb, setGlimeshThumb] = useState([]);
  const [glimeshStatus, setGlimeshStatus] = useState([]);

  const options = {
    "client-id":
      "AZPEhV3kYvOSOCx0GmXTI9F3W6uk3E-rsjGWzzcGRXKkzg-Ka7kWDyppbj0UsFP1-AsObs57mOK67nU3",
    currency: "USD",
  };

  let paypal = profile.paypal;

  const [amount, setAmount] = useState([]);
  const [orderID, setOrderID] = useState(false);
  const [message, setMessage] = useState([]);

  function createOrder(data, actions) {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: amount,
            },
            payee: {
              email_address: profile.paypal,
            },
          },
        ],
      })
      .then((orderID) => {
        setOrderID(orderID);
        return orderID;
      });
  }

  useEffect(() => {
    // subscription
    supabase
      .from("vw_posts_with_user")
      .on("*", (_payload) => {
        refreshData();
      })
      .subscribe();
  }, []);

  const router = useRouter();
  // Call this function whenever you want to
  // refresh props!
  const refreshData = () => {
    router.replace(router.asPath);
  };

  function onChange({ target: { value } }) {
    setAmount(value);
    setOrderID(false);
  }

  const [showModal, setShowModal] = React.useState(false);

  if (paypal) {
    paypal = (
      <>
        <input
          onChange={onChange}
          className="input"
          value={amount}
          placeholder="$2"
          autoFocus
          name="amount"
          id="amount"
        ></input>
        <br />
        <button
          className="bg-green-500 text-white hover:bg-green-600 font-bold uppercase text-sm px-6 py-3 rounded-full shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
          type="button"
          style={{ transition: "all .15s ease" }}
          onClick={() => setShowModal(true)}
        >
          Send dollo
        </button>
        {showModal ? (
          <>
            <div
              className="flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
              onClick={() => setShowModal(false)}
            >
              <div className="relative w-auto my-6 mx-auto max-w-3xl">
                {/*content*/}
                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full cards outline-none focus:outline-none">
                  {/*header*/}
                  <div className="flex items-start justify-between p-5 border-b border-solid border-gray-300 rounded-t">
                    <h3 className="text-5xl center font-semibold ">
                      Send ${amount} to {profile.username}
                    </h3>
                    <p>{message}</p>
                    <button
                      className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                      onClick={() => setShowModal(false)}
                    >
                      <span className="bg-transparent text-white opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                        ×
                      </span>
                    </button>
                  </div>
                  {/*body*/}
                  <div className="relative p-6 flex-auto">
                    <PayPalScriptProvider options={options}>
                      <PayPalButtons
                        createOrder={createOrder}
                        forceReRender={showModal}
                        style={{
                          color: "blue",
                          shape: "pill",
                          label: "pay",
                          height: 40,
                          tagline: false,
                        }}
                      />
                    </PayPalScriptProvider>
                  </div>
                  <div className="flex items-center justify-end p-6 border-t border-solid border-gray-300 rounded-b">
                    <button
                      className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1"
                      type="button"
                      style={{ transition: "all .15s ease" }}
                      onClick={() => setShowModal(false)}
                    >
                      Cancel dollo
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
          </>
        ) : null}
      </>
    );
  } else {
    paypal = <p>{profile.username} hasn't set up their dollo item.</p>;
  }

  let glimeshStatusChecker = glimeshStatus;

  let glimeshStats;

  if (glimeshStatusChecker === "LIVE") {
    glimeshStatusChecker = (
      <>
        <a
          className="none"
          href={`https://glimesh.tv/${profile.social.glimesh}`}
          target="_blank"
        >
          <span data-tip data-for="glimTitle" className="live">
            LIVE
          </span>
        </a>
        <ReactTooltip
          id="glimTitle"
          backgroundColor="#000"
          place="top"
          type="dark"
          effect="solid"
        >
          on Glimesh
        </ReactTooltip>
      </>
    );

    glimeshStats = (
      <a className="none" href={`https://glimesh.tv/${profile.social.glimesh}`}>
        <div className="cards flex cardGlimesh">
          <div>
            <img className="thumbnail" src={`${glimeshThumb}`} />
          </div>
          <div className="glimeshInfo">
            <h1 className="glimeshTitle">
              {glimeshStatusChecker}{" "}
              <span className="category">{glimeshCat}</span> {glimeshTitle}
            </h1>
            <div className="tagscont">
              {glimeshTags.map((tags) => (
                <span className="tags">{tags.name}</span>
              ))}
            </div>
          </div>
        </div>
      </a>
    );
  } else {
    glimeshStatusChecker = <></>;
  }

  async function getData() {
    axios({
      url: "https://corsanywhere12.herokuapp.com/https://glimesh.tv/api",
      method: "post",
      headers: {
        Authorization: `Client-ID 0096321eb6fdc5c33d664ecc7036e9629b9b957a4a787c9cac4df891ef39c224`,
      },
      data: {
        query: `{
        user(username: "${profile.social.glimesh}"){
          profileContentHtml,
          profileContentMd
        }
      }
        `,
      },
    }).then((result) => {
      setGlimeshHTML(result.data.data.user.profileContentMd);
    });

    axios({
      url: "https://corsanywhere12.herokuapp.com/https://glimesh.tv/api",
      method: "post",
      headers: {
        Authorization: `Client-ID 0096321eb6fdc5c33d664ecc7036e9629b9b957a4a787c9cac4df891ef39c224`,
      },
      data: {
        query: `{
      channel(username: "${profile.social.glimesh}"){
        status,
        title,
        category {
          name
        },
        tags {
          name
        },
        stream {
          countViewers,
          thumbnail,
          startedAt
        } 
      }
    }
        `,
      },
    }).then((result) => {
      setGlimeshStatus(result.data.data.channel.status);
      setGlimeshTitle(result.data.data.channel.title);
      setGlimeshCat(result.data.data.channel.category.name);
      setGlimeshTags(result.data.data.channel.tags);
      if (result.data.data.channel.stream) {
        setGlimeshThumb(result.data.data.channel.stream.thumbnail);
      } else {
        return null;
      }
    });
  }

  useEffect(() => {
    getData();
  }, []);

  let twitter = profile.social.twitter;

  if (twitter === null) {
    twitter = null;
  } else if (twitter) {
    twitter = (
      <>
        <a
          data-tip
          data-for="twitterTip"
          href={`https://twitter.com/${profile.social.twitter}`}
          target="_blank"
          className="social twitter"
        >
          <FontAwesomeIcon icon={["fab", "twitter"]} />
        </a>
        <ReactTooltip
          id="twitterTip"
          backgroundColor="#000"
          place="bottom"
          type="dark"
          effect="solid"
        >
          <TwitterTimelineEmbed
            sourceType="profile"
            screenName={profile.social.twitter}
            theme="dark"
            options={{ height: 400 }}
          />
        </ReactTooltip>
      </>
    );
  }

  let instagram = profile.social.instagram;

  if (instagram === null) {
    instagram = null;
  } else if (instagram) {
    instagram = (
      <>
        <a
          data-tip
          data-for="instagramTip"
          href={`https://instagram.com/${profile.social.instagram}`}
          target="_blank"
          className="social instagram"
        >
          <FontAwesomeIcon icon={["fab", "instagram"]} />
        </a>
        <ReactTooltip
          id="instagramTip"
          backgroundColor="#000"
          place="top"
          type="dark"
          effect="solid"
        >
          {profile.social.instagram}
        </ReactTooltip>
      </>
    );
  }

  let makerlog = profile.social.makerlog;

  if (makerlog === null) {
    makerlog = null;
  } else if (makerlog) {
    makerlog = (
      <>
        <a
          data-tip
          data-for="makerlogTip"
          href={`https://maker.to/${profile.social.makerlog}`}
          target="_blank"
          className="social makerlog"
        >
          <FontAwesomeIcon icon={["fas", "check-circle"]} />
        </a>
        <ReactTooltip
          id="makerlogTip"
          backgroundColor="#000"
          place="top"
          type="dark"
          effect="solid"
        >
          {profile.social.makerlog}
        </ReactTooltip>
      </>
    );
  }

  let github = profile.social.github;

  if (github === null) {
    github = null;
  } else if (github) {
    github = (
      <>
        <a
          data-tip
          data-for="githubTip"
          href={`https://github.com/${profile.social.github}`}
          target="_blank"
          className="social github"
        >
          <FontAwesomeIcon icon={["fab", "github"]} />
        </a>
        <ReactTooltip
          id="githubTip"
          backgroundColor="#000"
          place="top"
          type="dark"
          effect="solid"
        >
          {profile.social.github}
        </ReactTooltip>
      </>
    );
  }

  let sunshine = profile.social.sunshine;

  if (sunshine === null) {
    sunshine = null;
  } else if (sunshine) {
    sunshine = (
      <>
        <a
          data-tip
          data-for="sunshineTip"
          href={`https://sunshine.social/${profile.social.sunshine}`}
          target="_blank"
          className="social sunshine"
        >
          <img
            className="sunshine-img"
            src="https://sunshine.social/imgs/Sunshine_Social_Icon.png"
          />
        </a>
        <ReactTooltip
          id="sunshineTip"
          backgroundColor="#000"
          place="top"
          type="dark"
          effect="solid"
        >
          {profile.social.sunshine}
        </ReactTooltip>
      </>
    );
  }

  let glimesh = profile.social.glimesh;

  if (glimesh === null) {
    glimesh = null;
  } else if (glimesh) {
    glimesh = (
      <>
        <a
          data-tip
          data-for="glimeshTip"
          href={`https://glimesh.tv/${profile.social.glimesh}`}
          target="_blank"
          className="social glimesh"
        >
          <img
            className="glimesh-img"
            src="https://github.com/Glimesh/assets/blob/master/social/social-circle-middleish.png?raw=true"
          />
        </a>
        <ReactTooltip
          id="glimeshTip"
          backgroundColor="#000"
          place="top"
          type="dark"
          effect="solid"
        >
          {profile.social.glimesh}
        </ReactTooltip>
      </>
    );
  }

  let twitch = profile.social.twitch;

  if (twitch === null) {
    twitch = null;
  } else if (twitch) {
    twitch = (
      <>
        <a
          data-tip
          data-for="twitchTip"
          href={`https://twitch.tv/${profile.social.twitch}`}
          target="_blank"
          className="social twitch"
        >
          <FontAwesomeIcon icon={["fab", "twitch"]} />
        </a>
        <ReactTooltip
          id="twitchTip"
          backgroundColor="#000"
          place="top"
          type="dark"
          effect="solid"
        >
          {profile.social.twitch}
        </ReactTooltip>
      </>
    );
  }

  let guilded = profile.social.guilded;

  if (guilded === null) {
    guilded = null;
  } else if (guilded) {
    guilded = (
      <>
        <a
          data-tip
          data-for="guildedTip"
          href={`${profile.social.guilded}`}
          target="_blank"
          className="social guilded"
        >
          <FontAwesomeIcon icon={["fab", "guilded"]} />
        </a>
        <ReactTooltip
          id="guildedTip"
          backgroundColor="#000"
          place="top"
          type="dark"
          effect="solid"
        >
          {profile.social.guilded}
        </ReactTooltip>
      </>
    );
  }

  let discord = profile.social.discord;

  if (discord === null) {
    discord = null;
  } else if (discord) {
    discord = (
      <>
        <a
          data-tip
          data-for="discordTip"
          href={`${profile.social.discord}`}
          target="_blank"
          className="social discord"
        >
          <FontAwesomeIcon icon={["fab", "discord"]} />
        </a>
        <ReactTooltip
          id="discordTip"
          backgroundColor="#000"
          place="top"
          type="dark"
          effect="solid"
        >
          {profile.social.discord}
        </ReactTooltip>
      </>
    );
  }

  const deletePost = async (postID) => {
    await supabase
      .from("posts")
      .delete()
      .match({ id: `${postID}` });

    refreshData();
  };

  const formatDate = (date: string) => {
    return dayjs().to(dayjs(date));
  };

  let proChecker = profile.pro;

  if (proChecker === true) {
    proChecker = (
      <>
        <Link href="/pro">
          <span className="pro">PRO</span>
        </Link>
      </>
    );
  }

  let staffChecker = profile.staff;

  if (staffChecker === true) {
    staffChecker = (
      <>
        <span className="staff">STAFF</span>
      </>
    );
  }

  let modChecker = profile.mod;

  if (modChecker === true) {
    modChecker = (
      <>
        <span className="staff">MOD</span>
      </>
    );
  }

  let verifiedChecker = profile.verified;

  if (verifiedChecker === true || profile.social.twitter) {
    verifiedChecker = (
      <>
        <span className="verified">
          <FontAwesomeIcon icon={["fas", "check"]} />
        </span>
      </>
    );
  }

  if (profile.social === null) {
    profile.social = "";
  }

  const encodedDisplayname = encodeURI(profile.displayname);
  const encodedAvatar = encodeURI(profile.avatar);
  const encodedBio = encodeURI(profile.bio);

  return (
    <>
      <HeaderController
        title={profile.displayname}
        embed={{ image: profile.avatar }}
        description={profile.bio ? profile.bio : undefined}
      />
      <Head>
        <meta
          property="og:image"
          content={`https://api.placid.app/u/lf8kbnviy?&bio[text]=${encodedBio}&avatar[image]=${encodedAvatar}&displayname[text]=${encodedDisplayname}`}
        />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:width" content="1200" />
        <meta
          property="twitter:image"
          content={`https://api.placid.app/u/lf8kbnviy?&bio[text]=${encodedBio}&avatar[image]=${encodedAvatar}&displayname[text]=${encodedDisplayname}`}
        />
        <meta name="twitter:card" content="summary_large_image"></meta>
      </Head>
      <style
        dangerouslySetInnerHTML={{
          __html: `
      body { 
        background-image: url("${profile.background}") !important; 
        background-attachment: fixed !important;
        background-size: 100% !important;
      }
      `,
        }}
      />
      <style
        dangerouslySetInnerHTML={{
          __html: profile.css,
        }}
      />
      <div>
        <div className="herocont padd userdetails">
          <div
            className="justify-center profilecont"
            style={{ backgroundImage: `url(${profile.background_url})` }}
          >
            <div className="center avatarcont">
              <ImageFallback
                data-tip
                data-for={profile.username}
                className="avatar center"
                fallbackImage="avatar.png"
                src={profile.avatar}
              />
            </div>
            <div className="info mt-4">
              <h1 className="username">
                {profile.displayname ? profile.displayname : profile.username}{" "}
                {verifiedChecker}
                <div>
                  <span className="handle">@{profile.username}</span>
                </div>
                <div className="mt-3">
                  {staffChecker} {modChecker} {proChecker}{" "}
                </div>
              </h1>
              <p></p>
              <p className="bio">{profile.bio}</p>
            </div>
          </div>
          {profile.social && (
            <div
              className="cards flex socialcont"
              style={{ backgroundImage: `url(${profile.background_url})` }}
            >
              <div className="socials">
                {twitter}
                {instagram}
                {github}
                {makerlog}
                {sunshine}
                {glimesh}
                {twitch}
                {guilded}
                {discord}
              </div>
            </div>
          )}
          <div className="mt-4">{glimeshStats}</div>
          <div className="flex responsive">
            <div className="block">
              <div className="cards donate center mr-10">{paypal}</div>
            </div>
            <Tabs>
              <TabList>
                <Tab>Fyis</Tab>
                <Tab>About</Tab>
              </TabList>
              <TabPanel>
                <div className="posts">
                  {posts.data.map((post, index) => (
                    <div className="cards cardspost">
                      <div className="flex">
                        <div className="avatarcont">
                          <a href={`/${post.username}`}>
                            <img className="avatar avatar2" src={post.avatar} />
                          </a>
                        </div>
                        <div className="info ml-4">
                          <h1 className="username mb-2 left">
                            {post.displayname
                              ? post.displayname
                              : post.username}{" "}
                            <span className="handle">@{post.username}</span>
                            <span className="minutesago">
                              {formatDate(post.published_at)}
                            </span>
                          </h1>

                          <p className="postcontent">
                            <Markdown plugins={[gfm]} children={post.content} />
                          </p>
                        </div>
                      </div>
                      <div>
                        {session &&
                          (session.user.id === post.user_id ? (
                            <>
                              <button
                                onClick={() => deletePost(post.id)}
                                className="bg-red-500 text-gray-200 rounded hover:bg-red-400 px-6 py-2 focus:outline-none mx-1"
                              >
                                DELETE
                              </button>
                            </>
                          ) : (
                            <p></p>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              </TabPanel>
              <TabPanel>
                <div className="cards auto width">
                  <Markdown
                    plugins={[gfm]}
                    children={profile.html}
                    allowDangerousHtml={true}
                  />
                  <div>
                    {glimeshHTML && (
                      <div>
                        <div className="mb-5">
                          <span className="p-3 bg-blue-600 rounded-full">
                            Content synced from Glimesh
                          </span>
                        </div>
                        <Markdown
                          plugins={[gfm]}
                          children={`${glimeshHTML}`}
                          allowDangerousHtml={true}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </TabPanel>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
}

UserPage.getInitialProps = async (ctx) => {
  const { query } = ctx;
  const { body, error } = await supabase
    .from("profiles")
    .select("*")
    .ilike("username", query.username)
    .single();

  const posts = await supabase
    .from("vw_posts_with_user")
    .select()
    .ilike("username", query.username);

    var wildcard = ctx.req.headers.host.split(".")[0];


  return { profile: body, posts: posts, wildcard  };
};