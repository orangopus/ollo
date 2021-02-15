import Head from "next/head";
import { supabase } from '../utils/initSupabase'

export default function UserPage({ profile }) {
  return (
    <>
      <Head>
      <title>{profile.username} | libby</title>
      <link rel="icon" type="image/png" href={profile.avatar}></link>
      </Head>
      <div className="herocont center padd">
      <img className="avatar" src={profile.avatar} />
      <h1 className="username">{profile.username}</h1>
      <p className="desc">{profile.bio}</p>
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


