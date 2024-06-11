<template>
      <section class="w-full min-h-screen flex flex-col">
        <div class="herocont">
          <div class="row heropadding pt-7 herobg">
            <div class="center">
              <p class="herotext text-center pt-5">one little link, <span class="organised">organised.</span></p>
              <p class="blurb padding text-center center mt-5 mb-5">
                The free and open way to share your library to the web.   
              </p>
              <div class="usernameinput">
                    <div class="search-box">
                      <form class="flex center justify-center">
                        <span
                          class="flex items-center rounded rounded-r-none border-0 px-3 ml-3 font-bold text-white-100"><img src="/logo.svg" class="small" /> </span>
                        <input
                          class="h-16 align-middle text-grey-darker bg-none font-normal border-0 m-3 inputusername text-grey-darkest border border-gray-100 font-bold w-full py-1 px-2 outline-none text-lg text-white-600"
                          type="text" placeholder="your username here" />
                        <NuxtLink to="/dashboard" class="flex center">
                          <button class="button mr-5">Claim</button>
                        </NuxtLink>
                        
                      </form>
                    
                    </div>
  
                    
                  
                  </div>
              <br />
              <div class="center">
                <div class="center">                
                <Canny style="text-align: center"/>
                <br />
                <Link to ="https://go.orangop.us/discord">
                <p class="mt-5 minutesago blurple"><span class="w-3.5 h-3.5 bg-green-400 rounded-full"></span> 
                </p>
                </Link>
                </div>
              </div>
            </div>
          </div>
  
          <div class="grid grid-card container center dark p-5 gap-6 grid-cols-3 padd">
  
          <div class="grid-card hover dark p-5 center items-center">
  
            <img src="/postintegrations.png"/>
            
            <h1 class="bold mt-4 mb-2">Socially Integrated</h1>
            <p class="">Spice up your life with library widgets intended to streamline your content.</p>
          </div>
  
          <div class="grid-card p-5 my-auto col-span-2">
          <img src="/logo.svg" class="logo"/>
          <h1 class="bold mt-4 mb-2 left">Hi-5 creators</h1>
          <p class="left">It wouldn't be a social platform without giving your favourite content creators a hi-5 whenever they write good content.</p>
          </div>
  
          <div class="grid-card p-5 items-center">
            
            <h1 class="bold mt-4 mb-2">Building blocks</h1>
            <p>Create a free, dynamically generated profile. It works like magic.</p>
          </div>
  
          <div class="grid-card hover p-5 center bg-white items-center">
          <img src="/pally.svg" class="logo-block center"/>
          <h1 class="bold mt-4 mb-2 sub-black">Fully integrated</h1>
          <p class="sub-black">We integrate directly with Pally's API and we do not take a cut.</p>
          </div>
  
          <div class="grid-card hover p-5 center black items-center">
            <div class="flex items-center">
            <img src="https://pipedream.com/s.v0/app_1dBhP3/logo/96" class="logo-block center"/>
            </div>
            <h1 class="bold mt-4 mb-2">Powered by lightning</h1>
            <p>The power of Supanuxt makes our platform very quick like Sonic.
  
          </p>
          </div>
  
          <div class="grid-card p-5 my-auto col-span-1 hover text-center heartwatch">            
          <img src="/hyperate.svg" class="logo-block mt-4 mb-3 center"/>
          <p class="center">Streamer or scaredy cat? Integrate your watch's heartbeat into ollo.</p>
          </div>
  
          <div class="grid-card p-5 items-center col-span-2">      
          <div class="my-auto items-center">
          <img src="/unlock.png" class="logo-block mt-4 mb-3"/>     
            <h1 class="bold mt-4 mb-2 left">No paywalls. 100% free.</h1>
            <p class="left">We don't charge a penny for you to use the platform. If you feel the need to support the cause, you can contribute and get perks.
              We will never charge for features, only for the badge.
            </p>
          </div>  
          </div>
  
          <div class="grid grid-cols-5 col-span-3">
  
          <div class="grid-card p-5 items-center col-span-2 py5 unlock">    
            <p><span class="soon">in testing</span></p>  
            <h1 class="bold mt-4 mb-2">Developer API</h1>
            <p>View our creator API and see just how powerful our platform can be.</p>
            <code
      class="text-sm my-5 sm:text-base inline-flex text-left items-center space-x-4 bg-gray-800 text-white rounded-lg p-4 pl-6">
      <span class="flex gap-4">
          <span class="shrink-0 text-gray-500">
              $
          </span>
  
          <span class="flex-1">
              <span>
                  /api/getUser
              </span>
          </span>
      </span>
  
      <svg class="shrink-0 h-5 w-5 transition text-gray-500 group-hover:text-white" xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path d="M8 2a1 1 0 000 2h2a1 1 0 100-2H8z"></path>
          <path
              d="M3 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v6h-4.586l1.293-1.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L10.414 13H15v3a2 2 0 01-2 2H5a2 2 0 01-2-2V5zM15 11h2a1 1 0 110 2h-2v-2z">
          </path>
      </svg>
  </code>
  <br/>
  <code
      class="text-sm mb-5 sm:text-base inline-flex text-left items-center space-x-4 bg-gray-800 text-white rounded-lg p-4 pl-6">
      <span class="flex gap-4">
          <span class="shrink-0 text-gray-500">
              $
          </span>
  
          <span class="flex-1">
              <span>
                  /api/creator/[profile]
              </span>
          </span>
      </span>
  
      <svg class="shrink-0 h-5 w-5 transition text-gray-500 group-hover:text-white" xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path d="M8 2a1 1 0 000 2h2a1 1 0 100-2H8z"></path>
          <path
              d="M3 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v6h-4.586l1.293-1.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L10.414 13H15v3a2 2 0 01-2 2H5a2 2 0 01-2-2V5zM15 11h2a1 1 0 110 2h-2v-2z">
          </path>
      </svg>
  </code>
  <br/>
  <code
      class="text-sm sm:text-base inline-flex text-left items-center space-x-4 bg-gray-800 text-white rounded-lg p-4 pl-6">
      <span class="flex gap-4">
          <span class="shrink-0 text-gray-500">
              $
          </span>
  
          <span class="flex-1">
              <span>
                  /api/creators
              </span>
          </span>
      </span>
  
      <svg class="shrink-0 h-5 w-5 transition text-gray-500 group-hover:text-white" xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path d="M8 2a1 1 0 000 2h2a1 1 0 100-2H8z"></path>
          <path
              d="M3 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v6h-4.586l1.293-1.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L10.414 13H15v3a2 2 0 01-2 2H5a2 2 0 01-2-2V5zM15 11h2a1 1 0 110 2h-2v-2z">
          </path>
      </svg> 
  </code>
  <br/>
      <Link to="https://api.ollo.bio/docs">
      <button class="minutesago text-white mt-4">View API Docs</button>
      </Link>
          </div>
  
          <div class="grid grid-cols-2 col-span-3">
  
          <div class="grid-card p-5 items-center">        
          <p><span class="soon">coming soon</span></p>  
            <h1 class="bold mt-4 mb-2">Portfolio</h1>
            <p>If life gives you uwu, make a magicawwy genewated powtfowio.</p>
          </div>
          <div class="grid-card p-5 items-center">   
          <p><span class="soon">coming soon</span></p>       
            <h1 class="bold mt-4 mb-2">Domains</h1>
            <p>Imagine having a platform that auto-generates domains for you.</p>
          </div>
          <div class="grid-card p-5 items-center">   
          <p><span class="soon">coming soon</span></p>       
            <h1 class="bold mt-4 mb-2">Commissions</h1>
            <p>Talk in a private room between you and the client. Negotiate a price, pay for it. Simples. No platform-charges.</p>
  
          </div>
          <div class="grid-card p-5 items-center">   
          <p><span class="soon">NEW</span></p>       
            <h1 class="bold mt-4 mb-2">Posts</h1>
            <p>Create content on your page which supports Markdown and Rich Embeds.</p>
          </div>
  
  
          </div>
  
          </div>
  
          </div>
          <header class="center">
            <p class="gridtitle text-center">
              Customise and add <span class="personality">personality</span> <span>to your ollo</span>
            </p>
          </header>
          <Carousel />
          <div class="grid grid-cols-4 gap-10 padd my-10">
          <div class="grid-card dark p-5 red">
            <p class="gridsub">
            <br/>
              Can't be evil
            </p>
            <p>Our ethos is simple. We're privacy-focused and don't share your data with third-parties.</p>
            </div>
            <div class="grid-card p-5 green">
            <p class="gridsub green">
            <br/>
              Eco-friendly
            </p>
            <p class="green">We're trying to help the environment, but also not destroy it with awful procedurally-generated NFTs.</p>
            </div>
            <div class="grid-card dark p-5">
            <p class="gridsub">
  
            <br/>
              Open-source
            </p>
            <p>Our source code is open, because we're powered by the Orangopus Initiative.</p>
            </div>
            <div class="grid-card dark p-5 black">
            <p class="gridsub">
            <br/>
              Coded with ❤️
            </p>
            <p>Some code stuff here. Some command line there. It's hard work but crafted with love and joy.</p>
            </div>
          </div>
        </div>
  </section>
</template>

<script>
import Canny from '@/components/Canny.vue';

export default {
  components: {
    Canny,
  },
};
</script>