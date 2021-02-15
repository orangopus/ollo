import Head from "next/head";
import Link from 'next/link';

const Index = () => {
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

export default Index;
