import Head from "next/head";
import Link from "next/link";
import { supabase } from "../utils/initSupabase";
import Tilt from "react-parallax-tilt";
import ReactTooltip from "react-tooltip";

export default function Index({ profile }) {
  return (
    <div>
      <Head>
        <title>libby</title>
      </Head>
      <div className="herocont">
        <div className="row heropadding">
          <div className="center">
            <p className="herotext text-center">
              Branded profiles for creators and beyond.
            </p>
            <p className="text padding text-center">
              Quickly create a profile page with your brand in mind.
            </p>
            <Link href="/dashboard">
              <button className="button">Get started</button>
            </Link>
            <p className="tiny">libby is free forever!</p>
            <div className="justify-center center flex">
              {profile
                .filter((n) => n.username)
                .sort(() => Math.random() - Math.random())
                .slice(0, 10)
                .map((profile) => (
                  <div className="-mr-8 mb-10">
                    <a
                      className="profileavatar"
                      href={`/${profile.username ? profile.username : ""}`}
                    >
                      <img
                        data-tip
                        data-for={profile.username}
                        className="avatar small avatar2"
                        src={profile.avatar}
                      />
                    </a>
                    <ReactTooltip
                      id={profile.username}
                      backgroundColor="#000"
                      place="top"
                      type="dark"
                      effect="solid"
                    >
                      {profile.username}
                    </ReactTooltip>
                  </div>
                ))}
            </div>
            <div>
              <Tilt tiltReverse={true}>
                <img
                  className="profile mainimage center"
                  src="libby-profile-page.png"
                />
              </Tilt>
            </div>

            <div className="producthunt justify-center ">
              <a
                href="https://www.producthunt.com/posts/libbybio?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-libbybio"
                target="_blank"
              >
                <img
                  className="center"
                  src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=285339&theme=dark"
                  alt="libbybio - Branded profiles for creators and beyond. | Product Hunt"
                  width="250"
                  height="54"
                />
              </a>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="container center">
            <h1 className="h1">
              Glimesh Integration{" "}
              <span className="category">OUT OF THE BOX</span>
            </h1>
            <p className="text padding text-center">
              Featuring Live Cards and About Sync.
            </p>
            <img className="profile center" src="glimesh-integration.png" />
          </div>
        </div>
        <div className="row">
          <div className="container text-center">
            <h1 className="h1">
              Post Integrations <span className="live">COMING SOON</span>
            </h1>
            <p className="text padding text-center">
              Organise your social media in a clean posts tab.
            </p>
            <img className="profile center" src="postintegrations.png" />
            <img className="profile center" src="tweets.png" />
          </div>
        </div>
        <div className="row">
          <div className="container text-center">
            <h1 className="h1">
              Schedules <span className="live">COMING SOON</span>
            </h1>
            <p className="text padding text-center">
              A nice looking schedule for your profile.
            </p>

            <img className="profile schedule center" src="schedule.png" />
          </div>
        </div>
        <div className="row padd">
          <div className="container text-center">
            <h1 className="h1">Wield a Domain</h1>
            <p className="text padding text-center">
              Choose one of our domains or use a custom domain of your own.
            </p>
            {profile
              .filter((n) => n.username)
              .sort(() => Math.random() - Math.random())
              .slice(0, 1)
              .map((profile) => (
                <div className="cards domains">
                  <a
                    className="none"
                    href={`https://libby.gg/${
                      profile.username ? profile.username : ""
                    }`}
                  >
                    libby.gg/{profile.username}
                  </a>
                </div>
              ))}{" "}
            {profile
              .filter((n) => n.username)
              .sort(() => Math.random() - Math.random())
              .slice(0, 1)
              .map((profile) => (
                <span className="cards domains">
                  <a
                    className="none"
                    href={`https://streamer.is/${
                      profile.username ? profile.username : ""
                    }`}
                  >
                    streamer.is/{profile.username}
                  </a>
                </span>
              ))}
            <br />
            {profile
              .filter((n) => n.username)
              .sort(() => Math.random() - Math.random())
              .slice(0, 1)
              .map((profile) => (
                <span className="cards domains">
                  <a
                    className="none"
                    href={`https://maker.direct/${
                      profile.username ? profile.username : ""
                    }`}
                  >
                    maker.direct/{profile.username}
                  </a>
                </span>
              ))}{" "}
            {profile
              .filter((n) => n.username)
              .sort(() => Math.random() - Math.random())
              .slice(0, 1)
              .map((profile) => (
                <span className="cards domains">
                  <a
                    className="none"
                    href={`https://code.gdn/${
                      profile.username ? profile.username : ""
                    }`}
                  >
                    code.gdn/{profile.username}
                  </a>
                </span>
              ))}
            <br />
            {profile
              .filter((n) => n.username)
              .sort(() => Math.random() - Math.random())
              .slice(0, 1)
              .map((profile) => (
                <span className="cards domains">
                  <a
                    className="none"
                    href={`https://lists.surf/${
                      profile.username ? profile.username : ""
                    }`}
                  >
                    lists.surf/{profile.username}
                  </a>
                </span>
              ))}
            <span className="cards domains">
              <a className="none">
                yourdomain.com <span className="live">COMING SOON</span>
              </a>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  const { body, error } = await supabase.from("profiles").select("*");
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
