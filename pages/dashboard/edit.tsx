import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { supabase } from "../../utils/initSupabase";
import Link from "next/link";
import Markdown from "react-markdown";
import gfm from "remark-gfm";

library.add(fab, fas);

export default function UserPage({ profile }) {
  const [bio, setBio] = useState(profile.bio);
  const [username, setUsername] = useState(profile.username);
  const [displayname, setDisplayName] = useState(profile.displayname);
  const [avatar, setAvatar] = useState(profile.avatar);
  const [background, setBackground] = useState(profile.background_url);
  const [twitter, setTwitter] = useState(profile.social.twitter);
  const [instagram, setInstagram] = useState(profile.social.instagram);
  const [makerlog, setMakerlog] = useState(profile.social.makerlog);
  const [sunshine, setSunshine] = useState(profile.social.sunshine);
  const [glimesh, setGlimesh] = useState(profile.social.glimesh);
  const [twitch, setTwitch] = useState(profile.social.twitch);
  const [guilded, setGuilded] = useState(profile.social.guilded);
  const [discord, setDiscord] = useState(profile.social.discord);
  const [html, setHTML] = useState(profile.html);
  const [text, setText] = useState("Update");
  const [count, setCount] = useState(0);

  useEffect(() => {
    let interval = setInterval(() => {
      setText(text);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const updateProfile = async (event) => {
    event.preventDefault();
    await supabase
      .from("profiles")
      .update({
        bio,
        html,
        username,
        displayname,
        avatar,
        social: {
          twitter,
          instagram,
          makerlog,
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
      <div className="flex">
        <div className="herocont padd">
          <div className="cards">
            <form onSubmit={updateProfile}>
              <h1>Edit Profile</h1>
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
                placeholder="Change your background link..."
                className="input"
              />
              <br />
              <h1 className="edit">Display Name</h1>
              <input
                autoFocus
                id="bio"
                name="bio"
                value={displayname}
                onChange={(event) => setDisplayName(event.target.value)}
                type="text"
                placeholder="Change your display name..."
                className="input"
              />
              <br />
              <h1 className="edit">Username</h1>
              <input
                autoFocus
                id="bio"
                name="bio"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                type="text"
                placeholder="Change your username..."
                required
                className="input"
              />
              <br />
              <h1 className="edit">Bio</h1>
              <p className="editsub">125 characters</p>
              <textarea
                autoFocus
                id="bio"
                name="bio"
                value={bio}
                maxLength={125}
                onChange={(event) => {
                  setBio(event.target.value);
                  setCount(event.target.value.length);
                }}
                placeholder="Change your bio..."
                className="textarea"
              />
              <br />
              <br />
              <h1 className="edit">About</h1>
              <p className="editsub">Markdown/HTML/CSS supported</p>
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
            className="flex profilecont"
            style={{ backgroundImage: `url(${background})` }}
          >
            <div>
              <img className="avatar" src={avatar} />
            </div>
            <div className="info">
              <h1 className="username">
                {displayname ? displayname : username}{" "}
                <span className="handle">@{username}</span>
              </h1>
              <p className="bio">{bio}</p>
              <div className="profilelink">
                <Link href={`/${username}`}>
                  <a target="_blank">
                    <button className="button">View profile</button>
                  </a>
                </Link>
              </div>
            </div>
          </div>
          <div className="container cards">
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
