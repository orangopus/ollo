import type { MetaFunction } from "@remix-run/node";
import { Link, Outlet, useLoaderData, useParams } from "@remix-run/react";
import config from "../../package.json";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "context/UserContext";
import createServerSupabase from "utils/supabase.server";
import { json, LoaderFunctionArgs } from "@remix-run/node";

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
  console.log(subdomain)
  if (subdomain) {
    const {data: profile} = await supabase
      .from("profiles")
      .select("*")
      .eq("username", subdomain)
      .single()
      console.log(profile)
    profileData = profile;
  }

  return json({ profile: profileData }, { headers: response.headers });
};

export default function Index() {
  const user = useContext(UserContext);
  const {profile} = useLoaderData(); // Destructure profile from useLoaderData

  if (profile) {
    return (
      <section className="w-full min-h-screen flex flex-col">
        <div className="herocont">
          <div className="row heropadding pt-7 herobg">
            <div className="center">
              {/* Access profile.username and profile.bio */}
              <h1>Profile of {profile.username}</h1>
              <p className="text-center pt-5">
                {profile.bio}
              </p>
              {/* Render other profile-specific data here */}
            </div>
          </div>
        </div>
      </section>
    );
  }

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
