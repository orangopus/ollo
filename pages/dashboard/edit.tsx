import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { supabase } from "../../utils/initSupabase";
import Link from "next/link";

library.add(fab, fas)

export default function UserPage({ profile }) {
  const [bio, setBio] = useState(profile.bio);
  const [username, setUsername] = useState(profile.username)
  const [avatar, setAvatar] = useState(profile.avatar)
  const [twitter, setTwitter] = useState(profile.twitter)
  const updateProfile = async (event) => {
    event.preventDefault();
    await supabase
      .from("profiles")
      .update({
        bio,
        username,
        avatar,
        twitter
      })
      .eq("id", profile.id);
  };

  let twitters = profile.twitter 

  if (twitters === null) {
    twitters = null 
  } else if (twitters) {
    twitters = (
      <a href={`https://twitter.com/${profile.twitter}`} target="_blank" className="social">
                      <FontAwesomeIcon icon={["fab", "twitter"]} />
            </a>
          )
  }

  return (
    <>
    <div className="flex">

    <div className="herocont center padd2">
    <img className="avatar" src={profile.avatar} />
    <h1 className="username">{profile.username}</h1>
      <div className="profilelink">
      <a target="_blank" href={`/${profile.username}`}>View profile</a>
      </div>
      <div className="social">
      {twitters}
      </div>
      <div dangerouslySetInnerHTML={{ __html: profile.bio }} />
    </div>

    <div className="herocont center padd">
    <div className="cards">
    <form onSubmit={updateProfile}>
      <h1>Edit Profile</h1>
      <hr/>
    <h1 className="edit">Avatar URL</h1>
      <input
        id="bio"
        name="bio"
        value={avatar}
        onChange={(event) => setAvatar(event.target.value)}
        type="text"
        placeholder="Change your avatar link..."
        className="input"
      />
      <br/>
      <h1 className="edit">Username</h1>
      <input
        id="bio"
        name="bio"
        value={username}
        onChange={(event) => setUsername(event.target.value)}
        type="text"
        placeholder="Change your username..."
        required
         className="input"
      />
      <br/>
      <h1 className="edit">Twitter</h1>
      <input
        id="bio"
        name="bio"
        value={twitter}
        onChange={(event) => setTwitter(event.target.value)}
        type="text"
        placeholder="Twitter"
        className="input"
      />
      <br/>
      <h1 className="edit">Bio</h1>
      <p className="editsub">Custom HTML/CSS supported</p>
      <textarea
        id="bio"
        name="bio"
        value={bio}
        onChange={(event) => setBio(event.target.value)}
        placeholder="Change your bio..."
        className="textarea"
      />
      <br/>


      <button className="button" type="submit">Update</button>
    </form>
    </div>
    </div>

    </div>
    </>
  );
}
export async function getServerSideProps({ req }) {
  const { user } = await supabase.auth.api.getUserByCookie(req);
  console.log(user);
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