import { Link, useLoaderData, useOutletContext } from "@remix-run/react";
import { useEffect, useState } from "react";
import { Rnd } from "react-rnd";
import supabase from "utils/supabase";
import { SupabaseOutletContext } from "~/root";
import Spotify from "../components/spotify";
import {HypeRate} from "../components/hyperate";

export const loader = async ({ request, params, response }) => {
  const sup = supabase(request, response);
  const profileRes = await sup.from("profiles").select("*").eq("username", params.profile).single();

  const layoutsRes = await sup.from("layouts").select("*").eq("id", profileRes.data.id).single();
  const postsRes = await sup.from("vw_posts_with_user").select("*").eq("user_id", profileRes.data.id);

  return { profile: profileRes.data, layoutData: layoutsRes.data, posts: postsRes.data };
};

export default function Profile() {
  const { profile, layoutData, posts } = useLoaderData();
  const { supabase } = useOutletContext<SupabaseOutletContext>();
  const [user, setUser] = useState(null);

  const [positions, setPositions] = useState(layoutData || {});
  const [message, setMessage] = useState([]);

  let pally = profile.pally;



  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    fetchUser();
  }, [supabase]);

  useEffect(() => {
    if (layoutData) {
      setPositions(layoutData);
    }
  }, [layoutData]);

  const [amount, setAmount] = useState([]);
  const [showModal, setShowModal] = useState(false);

  function onChange({ target: { value } }) {
    setAmount(value);
  }

  if (pally) {
    pally = (
      <>
        <input
          onChange={onChange}
          className="input dollo"
          value={amount}
          placeholder="$2"
          autoFocus
          name="amount"
          id="amount"
        ></input>
        <br />
        <button
          className="bg-green-500 text-white hover:bg-green-600 font-bold uppercase text-sm px-6 py-3 rounded-full shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
          type="button"
          style={{ transition: "all .15s ease" }}
          onClick={() => setShowModal(true)}
        >
          Send dollo
        </button>
      </>
    );
  } else {
    pally = null;
  }

  const saveLayoutData = async (updatedPositions) => {
    try {
      if (user?.id === profile.id) {
        await supabase
          .from("layouts")
          .upsert({ id: profile.id, ...updatedPositions }, { onConflict: 'id' });
        console.log("Layout data updated successfully!");
      }
    } catch (error) {
      console.error("Error saving layout data:", error.message);
    }
  };

  useEffect(() => {
    if (Object.keys(positions).length > 0) {
      saveLayoutData(positions);
    }
  }, [positions, profile.id, user]);

  const handleDragStop = (id, e, d) => {
    const updatedPositions = {
      ...positions,
      [id]: {
        ...positions[id],
        x: d.x,
        y: d.y,
      }
    };
    setPositions(updatedPositions);
  };

  const handleResizeStop = (id, e, direction, ref, delta, position) => {
    const updatedPositions = {
      ...positions,
      [id]: {
        ...positions[id],
        width: ref.style.width,
        height: ref.style.height,
        x: position.x,
        y: position.y,
      }
    };
    setPositions(updatedPositions);
  };

  const style = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "20px",
    background: "#121212",
  };

  if (!user) {
    return <p>Please log in to view this page.</p>;
  }

  return (
    <>
      <Rnd
        style={style}
        size={{ width: positions.profile?.width || 200, height: positions.profile?.height || 200 }}
        position={{ x: positions.profile?.x || 200, y: positions.profile?.y || 200 }}
        onDragStop={(e, d) => handleDragStop("profile", e, d)}
        onResizeStop={(e, direction, ref, delta, position) => handleResizeStop('profile', e, direction, ref, delta, position)}
        id="profile"
        resizable
      >
        <div>
          <div>
            <div>
              <div
                style={{ backgroundImage: `url(${profile?.background_url})`, backdropFilter: "blur(4px)" }}
              >
                <div className="center avatarcont">
                  <img className="avatar" src={`https://pwchtpxjolxhjfamtxrb.supabase.co/storage/v1/object/public/uploads/public/avatars/${profile.id}?updated`} alt="Avatar" />
                </div>
                <div className="info mt-4 center">
                  <h1 className="username">
                    {profile?.displayname ? profile.displayname : profile?.username}{" "}
                  </h1>
                  <p className="bio">{profile?.bio}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Rnd>

      <Rnd
        size={{ width: positions.hyperate?.width || 200, height: positions.hyperate?.height || 200 }}
        position={{ x: positions.hyperate?.x || 0, y: positions.hyperate?.y || 0 }}
        onDragStop={(e, d) => handleDragStop('hyperate', e, d)}
        onResizeStop={(e, direction, ref, delta, position) => handleResizeStop('hyperate', e, direction, ref, delta, position)}
        id="hyperate"
        resizable
      >         
          {profile.heartbeat && <HypeRate hypeRateID={profile.heartbeat}/>}
      </Rnd>
      <Rnd
        size={{ width: positions.pally?.width || 200, height: positions.pally?.height || 200 }}
        position={{ x: positions.pally?.x || 0, y: positions.pally?.y || 0 }}
        onDragStop={(e, d) => handleDragStop('pally', e, d)}
        onResizeStop={(e, direction, ref, delta, position) => handleResizeStop('pally', e, direction, ref, delta, position)}
        id="pally"
        resizable
      >         
              <div
                style={{ backgroundImage: `url(${profile?.background_url})`, backdropFilter: "blur(4px)" }}
              >
                <div className="info mt-4 center">
                  {pally}
                </div>
              </div>
      </Rnd>
      {showModal ? (
          <>
            <div
              className="flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
              onClick={() => setShowModal(false)}
            >
              <div className="relative w-auto my-6 mx-auto max-w-3xl">
                {/*content*/}
                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full cards outline-none focus:outline-none">
                  {/*header*/}
                  <div className="flex items-start justify-between p-5 border-b border-solid border-gray-300 rounded-t">
                    <h3 className="text-5xl center font-semibold ">
                      Send ${amount} to {profile.pally}
                    </h3>
                    <p>{message}</p>
                    <button
                      className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                      onClick={() => setShowModal(false)}
                    >
                      <span className="bg-transparent text-white opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                        ×
                      </span>
                    </button>
                  </div>
                  {/*body*/}
                  <div className="relative p-6 flex-auto">
                    <p className="my-4 text-gray-600 text-lg leading-relaxed">
                      Are you sure you want to send ${amount} to {profile.pally}?

                      ${amount} has to be above $10.00

                      <Link to={`https://tip.new/${profile.pally}?amount=${amount}`}>
                        <button
                          className="bg-green-500 text-white hover:bg-green-600 font-bold uppercase text-sm px-6 py-3 rounded-full shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                          type="button"
                          style={{ transition: "all .15s ease" }}
                        >
                          Send ${amount}
                        </button>
                      </Link>
                    </p>
                  </div>
                  <div className="flex items-center justify-end p-6 border-t border-solid border-gray-300 rounded-b">
                    <button
                      className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1"
                      type="button"
                      style={{ transition: "all .15s ease" }}
                      onClick={() => setShowModal(false)}
                    >
                      Cancel dollo
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
          </>
        ) : null}
    </>
  );
}
