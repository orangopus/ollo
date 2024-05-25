import type { MetaFunction } from "@remix-run/node";
import { Link, Outlet, useLoaderData, useOutletContext, useParams } from "@remix-run/react";
import config from "../../package.json";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "context/UserContext";
import createServerSupabase from "utils/supabase.server";
import { json, LoaderFunctionArgs } from "@remix-run/node";
import { Rnd } from "react-rnd";
import { HypeRate } from "~/components/hyperate";
import { SupabaseOutletContext } from "~/root";

export const meta: MetaFunction = () => {
  return [
    { title: "ollo - one little link, organised." },
    { name: "description", content: "Welcome to ollo!" },
  ];
};
export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const response = new Response();
  const supabase = createServerSupabase({ request, response });
  const host = request.headers.get("host");
  const subdomain = host?.split(".")[0];  
  let profileData = null;
  if (subdomain) {
    const {data: profile} = await supabase
      .from("profiles")
      .select("*")
      .eq("username", subdomain)
      .single()
    profileData = profile;
  }

  else if (host) {
    const {data: profile} = await supabase
      .from("profiles")
      .select("*")
      .eq("custom_domain", host)
      .single()
    profileData = profile;
  }

  const layoutsRes = profileData ? await supabase.from("layouts").select("*").eq("id", profileData.id).single() : null;
  const postsRes = profileData ? await supabase.from("vw_posts_with_user").select("*").eq("user_id", profileData.id) : null;

  return json({ profile: profileData, layoutData: layoutsRes?.data, posts: postsRes?.data, host: host }, { headers: response.headers });
};

export default function Index() {
  const user = useContext(UserContext);
  const {profile} = useLoaderData(); // Destructure profile from useLoaderData
  const {host} = useLoaderData()
  console.log(host)
  if (profile) {
    const { profile, layoutData, posts } = useLoaderData() as { profile: any, layoutData: any, posts: any };
    const { supabase } = useOutletContext<SupabaseOutletContext>();
    const [user, setUser] = useState(null);

    const [positions, setPositions] = useState(layoutData || {});
    const [message, setMessage] = useState([]);

    let pally = profile.pally;
  
    useEffect(() => {
      const fetchUser = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
      };
  
      fetchUser();
    }, [supabase]);
  
    useEffect(() => {
      if (layoutData) {
        setPositions(layoutData);
      }
    }, [layoutData]);
  
    const [amount, setAmount] = useState([]);
    const [showModal, setShowModal] = useState(false);
  
    function onChange({ target: { value } }) {
      setAmount(value);
    }
  
    if (pally) {
      pally = (
        <>
          <input
            onChange={onChange}
            className="input dollo"
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
        </>
      );
    } else {
      pally = null;
    }
  
    const saveLayoutData = async (updatedPositions) => {
      try {
        if (user?.id === profile.id) {
          await supabase
            .from("layouts")
            .upsert({ id: profile.id, ...updatedPositions }, { onConflict: 'id' });
          console.log("Layout data updated successfully!");
        }
      } catch (error) {
        console.error("Error saving layout data:", error.message);
      }
    };
  
    useEffect(() => {
      if (Object.keys(positions).length > 0) {
        saveLayoutData(positions);
      }
    }, [positions, profile.id, user]);
  
    const handleDragStop = (id, e, d) => {
      const updatedPositions = {
        ...positions,
        [id]: {
          ...positions[id],
          x: d.x,
          y: d.y,
        }
      };
      setPositions(updatedPositions);
    };
  
    const handleResizeStop = (id, e, direction, ref, delta, position) => {
      const updatedPositions = {
        ...positions,
        [id]: {
          ...positions[id],
          width: ref.style.width,
          height: ref.style.height,
          x: position.x,
          y: position.y,
        }
      };
      setPositions(updatedPositions);
    };
  
    const style = {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "20px",
      background: "#121212",
    };
  
    return ( 
      <>
        <Rnd
          style={style}
          size={{ width: positions.profile?.width || 200, height: positions.profile?.height || 200 }}
          position={{ x: positions.profile?.x || 200, y: positions.profile?.y || 200 }}
          onDragStop={(e, d) => handleDragStop("profile", e, d)}
          onResizeStop={(e, direction, ref, delta, position) => handleResizeStop('profile', e, direction, ref, delta, position)}
          id="profile"
          resizable
        >
          <div>
            <div>
              <div>
                <div
                  style={{ backgroundImage: `url(${profile?.background_url})`, backdropFilter: "blur(4px)" }}
                >
                  <div className="center avatarcont">
                    <img className="avatar" src={`https://pwchtpxjolxhjfamtxrb.supabase.co/storage/v1/object/public/uploads/public/avatars/${profile.id}?updated`} alt="Avatar" />
                  </div>
                  <div className="info mt-4 center">
                    <h1 className="username">
                      {profile?.displayname ? profile.displayname : profile?.username}{" "}
                    </h1>
                    <p className="bio">{profile?.bio}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Rnd>
  
        <Rnd
          size={{ width: positions.hyperate?.width || 200, height: positions.hyperate?.height || 200 }}
          position={{ x: positions.hyperate?.x || 0, y: positions.hyperate?.y || 0 }}
          onDragStop={(e, d) => handleDragStop('hyperate', e, d)}
          onResizeStop={(e, direction, ref, delta, position) => handleResizeStop('hyperate', e, direction, ref, delta, position)}
          id="hyperate"
          resizable
        >         
            {profile.heartbeat && <HypeRate hypeRateID={profile.heartbeat}/>}
        </Rnd>
        <Rnd
          size={{ width: positions.pally?.width || 200, height: positions.pally?.height || 200 }}
          position={{ x: positions.pally?.x || 0, y: positions.pally?.y || 0 }}
          onDragStop={(e, d) => handleDragStop('pally', e, d)}
          onResizeStop={(e, direction, ref, delta, position) => handleResizeStop('pally', e, direction, ref, delta, position)}
          id="pally"
          resizable
        >         
                <div
                  style={{ backgroundImage: `url(${profile?.background_url})`, backdropFilter: "blur(4px)" }}
                >
                  <div className="info mt-4 center">
                    {pally}
                  </div>
                </div>
        </Rnd>
        <Rnd
          size={{ width: positions.socials?.width || 200, height: positions.socials?.height || 200 }}
          position={{ x: positions.socials?.x || 0, y: positions.socials?.y || 0 }}
          onDragStop={(e, d) => handleDragStop('socials', e, d)}
          onResizeStop={(e, direction, ref, delta, position) => handleResizeStop('socials', e, direction, ref, delta, position)}
          id="socials"
          resizable
        >         
                <div className="info mt-4 center">
                {profile.social && Array.isArray(profile.social) && profile.social.map((social, index) => (
                  <Link to={social.url} key={index}>
                    <span className="mb-4 p-4 bg-gray-800 rounded-lg">
                      <FontAwesomeIcon 
                        icon={['fab', social.icon]} 
                        className="text-5xl socialicon rounded-full" 
                        style={{ color: social.color, backgroundColor: social.background_color }} 
                      />
                    </span> 
                  </Link>
                ))}
                </div>
        </Rnd>
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
                        Send ${amount} to {profile.pally}
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
                      <p className="my-4 text-gray-600 text-lg leading-relaxed">
                        Are you sure you want to send ${amount} to {profile.pally}?
  
                        ${amount} has to be above $10.00
  
                        <Link to={`https://tip.new/${profile.pally}?amount=${amount}`}>
                          <button
                            className="bg-green-500 text-white hover:bg-green-600 font-bold uppercase text-sm px-6 py-3 rounded-full shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                            type="button"
                            style={{ transition: "all .15s ease" }}
                          >
                            Send ${amount}
                          </button>
                        </Link>
                      </p>
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
    return (
      <section className="w-full min-h-screen flex flex-col">
        <div className="herocont">
          <div className="row heropadding pt-7 herobg">
            <div className="center">
              <h1>Hey {JSON.stringify(user?.user_metadata)} </h1>
              <p className="herotext text-center pt-5">one little link, <span className="organised">organised.</span></p>
              <p className="blurb padding text-center mt-5 mb-5">
                The free and open way to share your library to the web.   
              </p>
              <div className="usernameinput">
                    <div className="search-box">
                      <form className="flex center justify-center">
                        <span
                          className="flex items-center rounded rounded-r-none border-0 px-3 ml-3 font-bold text-white-100"><img src="/logo.svg" className="small" /> </span>
                        <input
                          className="h-16 align-middle text-grey-darker  font-normal border-0 m-3 text-grey-darkest border border-gray-100 font-bold w-full py-1 px-2 outline-none text-lg text-gray-600"
                          type="text" placeholder="your username here" />
                        <Link to="/dashboard" className="flex center">
                          <button className=" bg-white align-middle items-center text-lg rounded-full text-black font-bold rounded-full"><FontAwesomeIcon icon={["fas", "circle-plus"]} className="plusicon" /></button>
                        </Link>
                        
                      </form>
                    
                    </div>
  
                    
                  
                  </div>
              <br />
              <div className="center">
                <div className="center">                
                  <p className="mt-5 minutesago">Version: {config.version}</p>
                </div>
              </div>
            </div>
          </div>
  
          <div className="grid grid-card container center dark p-5 gap-6 grid-cols-3 padd">
  
          <div className="grid-card hover dark p-5 center items-center">
  
            <img src="postintegrations.png"/>
            
            <h1 className="bold mt-4 mb-2">Socially Integrated</h1>
            <p className="">Spice up your life with library widgets intended to streamline your content.</p>
          </div>
  
          <div className="grid-card p-5 my-auto col-span-2">
          <img src="logo.svg" className="logo"/>
          <h1 className="bold mt-4 mb-2 left">Hi-5 creators</h1>
          <p className="left">It wouldn't be a social platform without giving your favourite content creators a hi-5 whenever they write good content.</p>
          </div>
  
          <div className="grid-card p-5 items-center">
          <FontAwesomeIcon icon={["fas", "cubes"]} size="6x" className="homeicon"/>
            
            <h1 className="bold mt-4 mb-2">Building blocks</h1>
            <p>Create a free, dynamically generated profile. It works like magic.</p>
          </div>
  
          <div className="grid-card hover p-5 center bg-white items-center">
          <img src="pally.svg" className="logo-block center"/>
          <h1 className="bold mt-4 mb-2 sub-black">Fully integrated</h1>
          <p className="sub-black">We integrate directly with Pally's API and we do not take a cut.</p>
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
          <img src="hyperate.svg" className="logo-block mt-4 mb-3 center"/>
          <p className="center">Streamer or scaredy cat? Integrate your watch's heartbeat into ollo.</p>
          </div>
  
          <div className="grid-card p-5 items-center col-span-2">      
          <div className="my-auto items-center">
          <img src="unlock.png" className="logo-block mt-4 mb-3"/>     
            <h1 className="bold mt-4 mb-2 left">No paywalls. 100% free.</h1>
            <p className="left">We don't charge a penny for you to use the platform. If you feel the need to support the cause, you can contribute and get perks.
              We will never charge for features, only for the badge.
            </p>
          </div>  
          </div>
  
          <div className="grid grid-cols-5 col-span-3">
  
          <div className="grid-card p-5 items-center col-span-2 py5 unlock">    
            <p><span className="soon">in testing</span></p>  
            <h1 className="bold mt-4 mb-2">Developer API</h1>
            <p>View our creator API and see just how powerful our platform can be.</p>
            <code
      className="text-sm my-5 sm:text-base inline-flex text-left items-center space-x-4 bg-gray-800 text-white rounded-lg p-4 pl-6">
      <span className="flex gap-4">
          <span className="shrink-0 text-gray-500">
              $
          </span>
  
          <span className="flex-1">
              <span>
                  /api/getUser
              </span>
          </span>
      </span>
  
      <svg className="shrink-0 h-5 w-5 transition text-gray-500 group-hover:text-white" xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path d="M8 2a1 1 0 000 2h2a1 1 0 100-2H8z"></path>
          <path
              d="M3 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v6h-4.586l1.293-1.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L10.414 13H15v3a2 2 0 01-2 2H5a2 2 0 01-2-2V5zM15 11h2a1 1 0 110 2h-2v-2z">
          </path>
      </svg>
  </code>
  <br/>
  <code
      className="text-sm mb-5 sm:text-base inline-flex text-left items-center space-x-4 bg-gray-800 text-white rounded-lg p-4 pl-6">
      <span className="flex gap-4">
          <span className="shrink-0 text-gray-500">
              $
          </span>
  
          <span className="flex-1">
              <span>
                  /api/creator/[profile]
              </span>
          </span>
      </span>
  
      <svg className="shrink-0 h-5 w-5 transition text-gray-500 group-hover:text-white" xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path d="M8 2a1 1 0 000 2h2a1 1 0 100-2H8z"></path>
          <path
              d="M3 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v6h-4.586l1.293-1.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L10.414 13H15v3a2 2 0 01-2 2H5a2 2 0 01-2-2V5zM15 11h2a1 1 0 110 2h-2v-2z">
          </path>
      </svg>
  </code>
  <br/>
  <code
      className="text-sm sm:text-base inline-flex text-left items-center space-x-4 bg-gray-800 text-white rounded-lg p-4 pl-6">
      <span className="flex gap-4">
          <span className="shrink-0 text-gray-500">
              $
          </span>
  
          <span className="flex-1">
              <span>
                  /api/creators
              </span>
          </span>
      </span>
  
      <svg className="shrink-0 h-5 w-5 transition text-gray-500 group-hover:text-white" xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path d="M8 2a1 1 0 000 2h2a1 1 0 100-2H8z"></path>
          <path
              d="M3 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v6h-4.586l1.293-1.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L10.414 13H15v3a2 2 0 01-2 2H5a2 2 0 01-2-2V5zM15 11h2a1 1 0 110 2h-2v-2z">
          </path>
      </svg>
  </code>
  <br/>
      <Link to="https://api.ollo.bio">
      <button className="minutesago text-white mt-4">View API Docs</button>
      </Link>
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
          <p><span className="soon">NEW <FontAwesomeIcon icon={["fas", "star"]} size="6x"/></span></p>       
            <h1 className="bold mt-4 mb-2">Posts</h1>
            <p>Create content on your page which supports Markdown and Rich Embeds.</p>
          </div>
  
  
          </div>
  
          </div>
  
          </div>
  
          <header className="center">
            <p className="gridtitle text-center">
              Customise and add <span className="personality">personality</span> <span>to your ollo</span>
            </p>
          </header>
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
  
            <FontAwesomeIcon icon={["fas", "code"]} size="6x" className="homeicon"/>
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
  </section>
    );
  }
}
