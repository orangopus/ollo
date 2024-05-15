import type { MetaFunction } from "@remix-run/node";
import { Link, Outlet } from "@remix-run/react";
import config from "../../package.json";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext } from "react";
import { UserContext } from "context/UserContext";
import createServerSupabase from "utils/supabase.server";
import { json, LoaderFunctionArgs } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "ollo - one little link, organised." },
    { name: "description", content: "Welcome to ollo!" },
  ];
};
export const loader = async({ request }: LoaderFunctionArgs) => {
  const response = new Response();
  const supabase = createServerSupabase({request, response});
  const {data} = await supabase.from("profiles").select();

  return json({messages: data ?? []}, {headers: response.headers})
}

export default function Index() {
  const user = useContext(UserContext);
  return (
    <section className="w-full min-h-screen flex flex-col">
      <div className="herocont">
        <div className="row heropadding pt-7 herobg">
          <div className="center">
            <h1>Hey {JSON.stringify(user)} </h1>
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
          <p className="minutesago">&#129668; -pro-tip: hover over the profiles to see them on the left.</p>
          <p className="gridtitle text-center">
            Customise and add <span className="personality">personality</span> <span>to your ollo</span>
          </p>
        </header>

        <div className="grid grid-cols-4 gap-10 my-10 padd">

          <div className="grid-card postcontent col-span-3">

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
