import Head from "next/head";
import Nav from "../components/Nav";
import { signIn, signOut, useSession } from "next-auth/client";
import Router, { useRouter } from 'next/router';

const Index = () => {
  const session = useSession();
  if (session === null) {
    return (
      <div>
        <Head>
          <title>libby - dashboard</title>
        </Head>
        <Nav />
        <div className="herocont">
          <div className="login">
            <div className="middle">
              <img className="avatar" src={session.user.image} />
            </div>
            <p className="username">{session.user.name}</p>
            <p className="bio">Inputting your information doesn't work yet! We're still coming up with a solution for that.</p>
            <div className="middle">
              <input className="input" placeholder="Bio"></input>
              <button className="button buttonmargin">Save</button>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <Head>
          <title>libby</title>
        </Head>
        <Nav />
        <div className="herocont">
          <div className="row heropadding">
            <div className="col-12 col-sm-12 text-center">
              <p className="herotext text-center">Branded profiles for creators and beyond.</p>
              <p className="text padding text-center">Quickly create a profile page with your brand in mind.</p>
              <button onClick={() => signIn()} className="button">Get started</button>
              <p className="tiny">libby is free forever!</p>
              <img className="profile" src="libby-profile-page.png" />

            </div>
          </div>
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
}


export default Index;
