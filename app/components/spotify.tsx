import { useEffect, useState } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { json, LoaderFunctionArgs, useLoaderData, useOutletContext } from "@remix-run/react";
import createSupabase from "utils/supabase";
import { SupabaseOutletContext } from "~/root";

export const loader = async ({ params }: LoaderFunctionArgs) => {

    const { supabase } = createSupabase();
    
    const spotify = await supabase.from("profiles").select() 
    .eq("username", params.profile).single();


    return json({ spotify: spotify });
  };

  export default function Spotify() {
    const spotify = useLoaderData();

    return (
      <div>
        <h1>Spotify</h1>
        
      </div>
    );
}