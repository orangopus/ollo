import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useLoaderData } from "@remix-run/react";
import { UserContext } from "context/UserContext";
import { useContext } from "react";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";
library.add(fab, fas);

// load posts from database
export const loader = async ({ request }: LoaderArgs) => {
  const response = new Response();
  const supabase = createServerSupabase({ request, response });

  const posts = await supabase.from("posts_with_likes").select().order('id', { ascending: false });
  const likes = await supabase.from("likes").select();
  const user = await supabase.auth.getUser()
  const profile = await supabase.from("profiles").select("*")

  return {
    user: user.data,
    profile: profile.data
  }
    
};
export default function Carousel() {
    const user = useLoaderData()
    const profile = useLoaderData()



    console.log(profile[0])

    return (
<div className="w-full">
      <div className="scroll">
    <div className="m-scroll">
        <>
        
        {profile?.messages.filter(profile => profile.avatar).map(function(data) {
            return (
                <>
                {data.username && data.avatar &&
                        <Link to={data.username}>
                    <div key={data.id} className="flex cards carousel" style={{backgroundImage: `url(${data.background_url})`}}>
                    <div className="rounded-2xl h-96 justify-center items-center">
                        {<img src={data.avatar} alt="avatar" className="rounded-full mt-7 h-24 w-24 avatar"/> ? <img src={data.avatar} alt="avatar" className="rounded-full mt-10 ml-10 h-24 w-24 avatar" /> : <FontAwesomeIcon icon={['fas', 'user-circle']} className="text-5xl text-white"/>}
                    </div>
                    </div>
                    </Link>
                }
                </>
            );
        })}
        </>
    </div>
      <div className="swiper-pagination "></div>
      </div>
      </div>
)
}