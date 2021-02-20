import Head from "next/head";
import Link from 'next/link';
import { supabase } from '../utils/initSupabase';

export default function Index({ profile })  {

  return (
      <div>
        <Head>
          <title>libby</title>
        </Head>
        <div className="herocont">
          <div className="row heropadding">
            <div className="col-12 col-sm-12 text-center">
              <p className="herotext text-center">Branded profiles for creators and beyond.</p>
              <p className="text padding text-center">Quickly create a profile page with your brand in mind.</p>
              <Link href="/dashboard">
              <button className="button">Get started</button>
              </Link>
              <p className="tiny">libby is free forever!</p>
              <div className="middle">
            {profile.slice(0, 10).map((profile) => (
            
            <div className="inline">
            <a className="profileavatar" href={`/${profile.username ? profile.username : ""}`}>
            <img className="avatar small avatar2" src={profile.avatar} />
            </a>
            </div>
            ))}
            <div className="inline avatar usercount">
              {`+${profile.length - 10}`}
            </div>
            </div>
              <img className="profile" src="libby-profile-page.png" />
              <div className="producthunt">
              <a href="https://www.producthunt.com/posts/libbybio?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-libbybio" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=285339&theme=dark" alt="libbybio - Branded profiles for creators and beyond. | Product Hunt" width="250" height="54" /></a>
              </div>
              </div></div>
          <div className="row">
            <div className="container text-center">
              <h1 className="h1">Post Integrations</h1>
              <p className="text padding text-center">Organise your social media in a clean posts tab.</p>
              <img className="profile domains" src="postintegrations.png" />
              <img className="profile domains" src="tweets.png" />
            </div>
          </div>
          <div className="row">
            <div className="container text-center">
              <h1 className="h1">Schedules</h1>
              <p className="text padding text-center">A nice looking schedule for your profile.</p>

              <img className="profile schedule" src="schedule.png" />
            </div>
          </div>  
          <div className="row">
            <div className="container text-center">
              <h1 className="h1">Wield a Domain</h1>
              <p className="text padding text-center">Choose one of our domains or use a custom domain of your own.</p>

              <img className="profile domains" src="domains.png" />
            </div>
          </div>
        </div>
      </div>
    );
  }


  export async function getServerSideProps() {

    const { body, error } = await supabase
      .from("profiles")
      .select("*")
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
  