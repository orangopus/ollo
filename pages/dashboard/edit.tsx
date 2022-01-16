import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { fas, faSatelliteDish } from "@fortawesome/free-solid-svg-icons";
import { supabase } from "../../utils/initSupabase";
import Link from "next/link";
import Markdown from "react-markdown";
import gfm from "remark-gfm";
import EdiText from "react-editext";

library.add(fab, fas);

export default function UserPage({ profile }) {
  const [bio, setBio] = useState(profile.bio);
  const [username, setUsername] = useState(profile.username);
  const [displayname, setDisplayName] = useState(profile.displayname);
  const [avatar, setAvatar] = useState(profile.avatar);
  const [paypal, setPayPal] = useState(profile.paypal);
  const [background, setBackground] = useState(profile.background_url);
  const [backgroundURL, setBackgroundURL] = useState(profile.background);
  const [twitter, setTwitter] = useState(profile.social.twitter);
  const [instagram, setInstagram] = useState(profile.social.instagram);
  const [makerlog, setMakerlog] = useState(profile.social.makerlog);
  const [github, setGithub] = useState(profile.social.github);
  const [sunshine, setSunshine] = useState(profile.social.sunshine);
  const [glimesh, setGlimesh] = useState(profile.social.glimesh);
  const [twitch, setTwitch] = useState(profile.social.twitch);
  const [guilded, setGuilded] = useState(profile.social.guilded);
  const [discord, setDiscord] = useState(profile.social.discord);
  const [html, setHTML] = useState(profile.html);
  const [css, setCSS] = useState(profile.css);
  const [text, setText] = useState("Update");
  const [count, setCount] = useState(0);

  useEffect(() => {
    let interval = setInterval(() => {
      setText(text);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const updateDisplayName = async (displayname) => {
    setDisplayName(displayname);
    await supabase
      .from("profiles")
      .update({
        displayname,
      })
      .eq("id", profile.id);
  };

  const updateUsername = async (username) => {
    setUsername(username);
    await supabase
      .from("profiles")
      .update({
        username,
      })
      .eq("id", profile.id);
  };

  const updateBio = async (bio) => {
    setBio(bio);
    await supabase
      .from("profiles")
      .update({
        bio,
      })
      .eq("id", profile.id);
  };

  const updateProfile = async (event) => {
    event.preventDefault();
    await supabase
      .from("profiles")
      .update({
        html,
        css,
        avatar,
        paypal,
        background: backgroundURL,
        background_url: background,
        social: {
          twitter,
          instagram,
          makerlog,
          github,
          sunshine,
          glimesh,
          twitch,
          guilded,
          discord,
        },
      })
      .eq("id", profile.id);
  };

  if (profile.html === null) {
    profile.html = "You haven't set an About section yet...";
  }

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
      body { 
        background-image: url("${backgroundURL}") !important; 
        background-attachment: fixed !important;
        background-size: 100% !important;
      }
      `,
        }}
      />
      <div className="flex">
        <div className="herocont padd">
          <div className="cards">
            <form onSubmit={updateProfile}>
              <h1 className="text-2xl font-bold mb-4">Edit Ollo</h1>
              <hr />
              <h1 className="edit">Avatar URL</h1>
              <input
                autoFocus
                id="bio"
                name="bio"
                value={avatar}
                onChange={(event) => setAvatar(event.target.value)}
                type="text"
                placeholder="Change your avatar link..."
                className="input"
              />
              <br />
              <h1 className="edit">Banner URL</h1>
              <input
                autoFocus
                id="bio"
                name="bio"
                value={background}
                onChange={(event) => setBackground(event.target.value)}
                type="text"
                placeholder="Change your banner background..."
                className="input"
              />
              <br />
              <h1 className="edit">Background URL</h1>
              <input
                autoFocus
                id="bio"
                name="bio"
                value={backgroundURL}
                onChange={(event) => setBackgroundURL(event.target.value)}
                type="text"
                placeholder="Change your background..."
                className="input"
              />
              <br />
              <h1 className="edit">About</h1>
              <p className="editsub">Markdown/HTML supported</p>
              <textarea
                autoFocus
                id="bio"
                name="bio"
                value={html}
                onChange={(event) => setHTML(event.target.value)}
                placeholder="..."
                className="textarea"
              />
              <br />
              <br />
              <h1 className="edit">Custom CSS</h1>
              <p className="editsub">Warning: Be careful.</p>
              <textarea
                autoFocus
                id="bio"
                name="bio"
                value={css}
                onChange={(event) => setCSS(event.target.value)}
                placeholder="..."
                className="textarea"
              />
              <br />
              <br />
              <h1 className="edit">Dollo</h1>
              <p className="editsub">
                Please note your PayPal email will be public in the API.
              </p>
              <input
                autoFocus
                id="bio"
                name="bio"
                value={paypal}
                onChange={(event) => setPayPal(event.target.value)}
                type="text"
                placeholder="PayPal email..."
                className="input"
              />
              <h1 className="edit">Twitter</h1>
              <input
                autoFocus
                id="bio"
                name="bio"
                value={twitter}
                onChange={(event) => setTwitter(event.target.value)}
                type="text"
                placeholder="Twitter username..."
                className="input"
              />
              <br />
              <h1 className="edit">Instagram</h1>
              <input
                autoFocus
                id="bio"
                name="bio"
                value={instagram}
                onChange={(event) => setInstagram(event.target.value)}
                type="text"
                placeholder="Instagram username..."
                className="input"
              />
              <br />
              <h1 className="edit">GitHub</h1>
              <input
                autoFocus
                id="bio"
                name="bio"
                value={github}
                onChange={(event) => setGithub(event.target.value)}
                type="text"
                placeholder="GitHub username..."
                className="input"
              />
              <br />
              <h1 className="edit">Makerlog</h1>
              <input
                autoFocus
                id="bio"
                name="bio"
                value={makerlog}
                onChange={(event) => setMakerlog(event.target.value)}
                type="text"
                placeholder="Makerlog username..."
                className="input"
              />
              <br />
              <h1 className="edit">Sunshine Social</h1>
              <input
                autoFocus
                id="bio"
                name="bio"
                value={sunshine}
                onChange={(event) => setSunshine(event.target.value)}
                type="text"
                placeholder="Sunshine username..."
                className="input"
              />
              <br />
              <h1 className="edit">Glimesh</h1>
              <input
                autoFocus
                id="bio"
                name="bio"
                value={glimesh}
                onChange={(event) => setGlimesh(event.target.value)}
                type="text"
                placeholder="Glimesh username..."
                className="input"
              />
              <br />

              <h1 className="edit">Twitch</h1>
              <input
                autoFocus
                id="bio"
                name="bio"
                value={twitch}
                onChange={(event) => setTwitch(event.target.value)}
                type="text"
                placeholder="Twitch username..."
                className="input"
              />
              <br />

              <h1 className="edit">Guilded</h1>
              <input
                autoFocus
                id="bio"
                name="bio"
                value={guilded}
                onChange={(event) => setGuilded(event.target.value)}
                type="text"
                placeholder="Guilded invite..."
                className="input"
              />
              <br />
              <h1 className="edit">Discord</h1>
              <input
                autoFocus
                id="bio"
                name="bio"
                value={discord}
                onChange={(event) => setDiscord(event.target.value)}
                type="text"
                placeholder="Discord invite..."
                className="input"
              />
              <br />

              <div className="center">
                <button
                  className="button"
                  onClick={() => setText("Updated! 🎉")}
                  type="submit"
                >
                  {text}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="herocont padd userdetails">
          <div
            className="justify-center profilecont"
            style={{ backgroundImage: `url(${background})` }}
          >
            <div className="center avatarcont">
              <img className="avatar center" src={avatar} />
            </div>
            <div className="info mt-4">
              <h1 className="username">
                <EdiText
                  value={displayname}
                  onSave={updateDisplayName}
                  editOnViewClick={true}
                  type="text"
                  editContainerClassName="editflex"
                  mainContainerClassName="editflex"
                  viewContainerClassName="editflex"
                />
                <span className="handle">
                  @
                  <EdiText
                    value={username}
                    onSave={updateUsername}
                    editOnViewClick={true}
                    type="text"
                    editContainerClassName="editflex"
                    mainContainerClassName="editflex"
                    viewContainerClassName="editflex"
                  />
                </span>
              </h1>
              <p className="bio">
                <EdiText
                  value={bio}
                  onSave={updateBio}
                  editOnViewClick={true}
                  type="textarea"
                  editContainerClassName="bio"
                  mainContainerClassName="bio"
                  viewContainerClassName="bio"
                />
              </p>
              <div className="profilelink">
                <Link href={`/${username}`}>
                  <a target="_blank">
                    <button className="button">View ollo</button>
                  </a>
                </Link>
              </div>
            </div>
          </div>
          <div className="container cards">
            <style
              dangerouslySetInnerHTML={{
                __html: css,
              }}
            />
            <Markdown
              plugins={[gfm]}
              children={html}
              allowDangerousHtml={true}
            />
          </div>
        </div>
      </div>
    </>
  );
}
export async function getServerSideProps({ req }) {
  const { user } = await supabase.auth.api.getUserByCookie(req);
  const { body, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();
  if (!body) {
    return {
      notFound: true,
    };
  }
  return {
    props: {
      profile: body,
    },
  };
}
