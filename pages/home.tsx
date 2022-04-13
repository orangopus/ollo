import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { supabase } from "../utils/initSupabase";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Markdown from "react-markdown";
import gfm from "remark-gfm";
import Link from "next/link";
import Head from "next/head";
import ImageFallback from "react-image-fallback";
import EdiText from "react-editext";
import SuperEllipse from "react-superellipse";
import Nav from "../components/Nav"
import Footer from "../components/Footer"

dayjs.extend(relativeTime);
library.add(fab, fas);

export default function UserPage({ posts, user, profiles }) {
  const [post, setPost] = useState(posts.content);
  const session = supabase.auth.session();
  const [profile, setProfile] = useState([]);
  const [edit, editPost] = useState([]);

  const router = useRouter();
  // Call this function whenever you want to
  // refresh props!
  const refreshData = () => {
    router.replace(router.asPath);
  };

  useEffect(() => {
    async function fetchProfile() {
      if (user) {
        const { body, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();

        setProfile(body.avatar);
      }
    }

    fetchProfile();

    // subscription
    supabase
      .from("posts")
      .on("*", (_payload) => {
        refreshData();
      })
      .subscribe();
  }, []);

  const createPost = async (event) => {
    event.preventDefault();
    await supabase.from("posts").insert([{ content: post, user_id: user.id }]);
    setPost("");
  };

  const editPosts = async (edit, editID) => {
    await supabase
      .from("posts")
      .update({
        content: edit,
      })
      .eq("id", editID);
  };

  const deletePost = async (postID) => {
    await supabase
      .from("posts")
      .delete()
      .match({ id: `${postID}` });
  };

  const formatDate = (date: string) => {
    return dayjs().to(dayjs(date));
  };

  return (
    <>
      <Head>
        <title>Home | ollo</title>
      </Head>
      <div>
        <div className="herocont container mx-auto feed2 grid gap-10 mx grid-cols-4 postsfeed">
          <div className="grid col-span-3">
            {user && (
              <div className="cards flex">
                <img className="avatar" src={`${profile}`} />
                <form className="postcontainer" onSubmit={createPost}>
                  <div className="postcontainer">
                    <textarea
                      id="clearPost"
                      name="bio"
                      value={post}
                      onChange={(event) => setPost(event.target.value)}
                      placeholder="What have you done today?"
                      className="textarea postinput"
                    />
                    <button className="button postsubmit" type="submit">
                      Post
                    </button>
                    <p className="postmarkdown">
                      <FontAwesomeIcon icon={["fab", "markdown"]} /> is
                      supported
                    </p>
                  </div>
                </form>
              </div>
            )}
            {user === null && (
              <Link href="/dashboard">
                <div className="created2">
                  <div className="cards created">
                    <div className="create">
                      <h1 className="createTitle text-4xl">
                        Create a post, edit your ollo and do more...
                      </h1>
                      <p className="createText text-2xl p-1">
                        Create an ollo or login to make a post!
                      </p>
                      <button className="button">Get started</button>
                    </div>
                    <div className="inline2">
                      {profiles
                        .sort(() => Math.random() - Math.random())
                        .filter((n) => n.username)
                        .slice(0, 30)
                        .map((profile) => (
                          <div className="item">
                            <a
                              className="profileavatar"
                              href={`/${profile.username ? profile.username : ""
                                }`}
                            >
                              <ImageFallback
                                data-tip
                                data-for={profile.username}
                                className="avatar avatar3"
                                fallbackImage="avatar.png"
                                src={profile.avatar}
                              />
                            </a>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </Link>
            )}
            {posts.data.map((post, index) => (
              <div className="cards postcard">
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
                      <br />
                      <a className="minutesago" href={`posts/${post.id}`}>
                        {formatDate(post.published_at)}
                      </a>
                    </h1>
                    <br />
                  </div>
                </div>
                <p className="postcontent">
                  {session &&
                    (user.id === post.user_id ? (
                      <>
                        <EdiText
                          key={post.id}
                          value={post.content}
                          onSave={(value) => editPosts(value, post.id)}
                          submitOnEnter
                          type="textarea"
                          renderValue={(value) => {
                            return (
                              <Markdown
                                plugins={[gfm]}
                                children={post.content}
                              />
                            );
                          }}
                        />
                      </>
                    ) : (
                      <Markdown plugins={[gfm]} children={post.content} />
                    ))}
                  {session === null && (
                    <>
                      <Markdown plugins={[gfm]} 
                      
                      renderers={{
                        link: (props) => {
                          return props.href.endsWith('.gif') ? (
                            <div>
                            <a href={props.href}>{props.children}</a>
                              <img className="grid-card" src={props.href}/>
                            </div>
                          ) : (
                              <a href={props.href}>{props.children}</a> // All other links
                          );
                      },
                      handle: (props) => {
                        return props.username.startsWith('@') (
                          <div>
                          <a href={props.username}>{props.username}</a>
                            {props.username}
                          </div>
                        )
                    }
                    }}
                      children={post.content} />
                    </>
                  )}
                </p>
                <div className="mt-2">
                <span className="minutesago mr-2">
                    like
                  </span>
                <span className="minutesago reply">
                    reply
                  </span>
                </div>
                <div>
                  {session &&
                    (session.user.id === post.user_id ? (
                      <>
                        <button
                          onClick={() => deletePost(post.id)}
                          className="bg-red-500 text-gray-200 minutesago"
                        >
                          delete
                        </button>
                      </>
                    ) : (
                      <p></p>
                    ))}
                </div>
              </div>
            ))}
          </div>
          <div className="col-span-1">
            <h1 className="gridtitle ml-4">Recommended ollos</h1>
            <br />
            <div className="suggested dark">
              {profiles
                .sort(() => Math.random() - Math.random())
                .filter((n) => n.username)
                .slice(0, 5)
                .map((profile) => (
                  <a
                    className="handle none"
                    href={`/${profile.username}`}
                  >
                    <div className=" flex text-left suggest p-3">
                      <ImageFallback
                        data-tip
                        data-for={profile.username}
                        className="avatar-hp"
                        fallbackImage="../avatar.png"
                        src={profile.avatar ? profile.avatar : "../avatar.png"}
                      />
                      <div>

                        {profile.displayname ? profile.displayname : profile.username}
                        <p className="greyhandle">
                          @{profile.username}
                        </p>
                      </div>
                    </div>
                  </a>
                ))}
            </div>

              <div className="grid-card black mt-5 pro-panel hover cards">
                <div className="flex">
                <img className="pro-badge" src="probadge.png"/>
                </div>
                <p className="mt-3 mb-4">While all of our features are completely free and open-source, you can support us on our Open Collective page.</p>

                <p className="mt-4 mb-2"><span className="pro pr-4 pl-4 bold">EARLY SUPPORTERS</span></p>
                      <br/>
                <div className="grid grid-cols-5">
                  
            {profiles
                .filter(p => p.pro === true)
                .map((p) => (
                  <>
                                    <a
                    className="handle none"
                    href={`/${p.username}`}
                  >
                  <ImageFallback
                        data-tip
                        data-for={p.username}
                        fallbackImage="avatar.png"
                        src={p.avatar}
                        style={{width: 64, height: 64}} className="mb-3 pro-outline rounded-full"
                      />
                      </a>
                  </>
            ))}
                </div>
              </div>

              <a className="none" href="https://orangop.us.discord" target="_blank">
              <div className="grid-card hover mt-5 mb-5 discord cards">
                <FontAwesomeIcon icon={["fab", "discord"]} size="6x" className="homeicon mb-3" />
                <p className="gridsub">
                  Discord
                </p>
                <p>Become apart of our cult. Well it's not a cult exactly. Join our Discord for tips, tricks and assistance!</p>
              </div>
            </a>


          </div>
        </div>
      </div>
    </>
  );
}
export async function getServerSideProps({ req }) {
  const { user } = await supabase.auth.api.getUserByCookie(req);

  const { body } = await supabase.from("profiles").select("*");

  const posts = await supabase.from("vw_posts_with_user").select();

  return {
    props: {
      profiles: body,
      user: user,
      posts: posts,
    },
  };
}
