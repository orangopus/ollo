import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useLoaderData, useOutletContext } from "@remix-run/react";
import { UserContext } from "context/UserContext";
import { useContext } from "react";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { SupabaseOutletContext } from "~/root";
import createSupabase from "utils/supabase";
library.add(fab, fas);

export const loader = async () => {
  const response = new Response();
  const { supabase } = createSupabase();

  const posts = await supabase.from("posts_with_likes").select().order('id', { ascending: false });
  const likes = await supabase.from("likes").select();
  const user = await supabase.auth.getUser()
  const profiles = await supabase.from("profiles").select("*")

  return {
    user: user.data,
    profiles: profiles.data
  }
    
};
export default function Carousel() {
    const user = useLoaderData()
    const profile = useLoaderData()



    console.log(profile)

    return (
<div className="w-full">
      <div className="scroll">
    <div className="m-scroll">
        <>
        {JSON.stringify(profile)}
        </>
    </div>
      <div className="swiper-pagination "></div>
      </div>
      </div>
)
}