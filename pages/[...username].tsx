import Head from "next/head";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { supabase } from '../utils/initSupabase'

library.add(fab, fas)

export default function UserPage({ profile }) {

  let twitter = profile.twitter 

  if (twitter === null) {
    twitter = null 
  } else if (twitter) {
    twitter = (
      <a href={`https://twitter.com/${profile.twitter}`} target="_blank" className="social">
                      <FontAwesomeIcon icon={["fab", "twitter"]} />
            </a>
          )
  }

  return (
    <>
      <Head>
      <title>{profile.username} | libby</title>
      <link rel="icon" type="image/png" href={profile.avatar}></link>
      </Head>
      <div className="herocont center padd">
      <img className="avatar" src={profile.avatar} />
      <h1 className="username">{profile.username}</h1>
      {twitter}
      <div dangerouslySetInnerHTML={{ __html: "<p>" + profile.bio + "</p>"}} />
      </div>
    </>
  );
}
export async function getServerSideProps(context) {

  const { body, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", context.params.username)
    .single();
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


