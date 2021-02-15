import { useState } from "react";
import { supabase } from "../../utils/initSupabase";
export default function UserPage({ profile }) {
  const [bio, setBio] = useState(profile.bio);
  const [username, setUsername] = useState(profile.username)
  const [avatar, setAvatar] = useState(profile.avatar)
  const updateProfile = async (event) => {
    event.preventDefault();
    await supabase
      .from("profiles")
      .update({
        bio,
        username,
        avatar
      })
      .eq("id", profile.id);
  };

  function refreshPage() {
    window.location.reload();
  }

  return (
    <div className="herocont center padd">
    <div className="cards">
    <img className="avatar" src={profile.avatar} />
    <h1 className="username">{profile.username}</h1>
    <p className="desc">{profile.bio}</p>
    <form onSubmit={updateProfile}>
      <input
        id="bio"
        name="bio"
        value={avatar}
        onChange={(event) => setAvatar(event.target.value)}
        type="text"
        placeholder="Change your avatar link..."
        required
        className="input"
      />
      <br/>
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
      <textarea
        id="bio"
        name="bio"
        value={bio}
        onChange={(event) => setBio(event.target.value)}
        placeholder="Change your bio..."
        required
        className="textarea"
      />
      <br/>
      <button className="button" onClick={refreshPage} type="submit">Update</button>
    </form>
    </div>
    </div>
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