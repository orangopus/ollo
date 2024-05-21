import { useEffect, useState } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { json, LoaderFunctionArgs, useLoaderData, useOutletContext } from "@remix-run/react";
import createSupabase from "utils/supabase";
import { SupabaseOutletContext } from "~/root";

type LikeButtonProps = {
  postId: number;
  initialLikes?: number;
};

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { postId } = params;
  const { supabase } = createSupabase();

  try {
    const { user } = await supabase.auth.getUser();
    const { data: likes, error } = await supabase
      .from("likes")
      .select("count(*)", { count: "exact" })
      .eq("post_id", postId)
      .eq("user_id", user?.id);

    if (error) throw error;

    return json({ user, likes: likes.length > 0 ? likes[0].count : 0 });
  } catch (error) {
    console.error("Error fetching likes:", error.message);
    return json({ user: null, likes: 0 });
  }
};

export default function Like({ postId, initialLikes = 0 }: LikeButtonProps) {
  const { supabase } = useOutletContext<SupabaseOutletContext>();
  const { user, likes: initialLikesCount } = useLoaderData();
  
  const [liked, setLiked] = useState<boolean>(false);
  const [likes, setLikes] = useState<number>(initialLikes || initialLikesCount);

  useEffect(() => {
    const fetchLikes = async () => {
      if (!user) return;

      try {
        const { data: likesData, error } = await supabase
          .from("likes")
          .select("count(*)", { count: "exact" })
          .eq("post_id", postId)
          .eq("user_id", user.id);

        if (error) throw error;

        const likesCount = Number(likesData.length > 0 ? likesData[0].count : 0);
        setLiked(likesCount > 0);
        setLikes(likesCount);
      } catch (error) {
        console.error("Error fetching likes:", error.message);
      }
    };

    fetchLikes();
  }, [postId, user, supabase]);

  const updateLikesCount = async (increment: boolean) => {
    try {
      const updatedLikes = increment ? likes + 1 : Math.max(likes - 1, 0);
      setLikes(updatedLikes);

      if (increment) {
        await supabase.from("likes").insert({ post_id: postId, user_id: user.id });
      } else {
        await supabase.from("likes").delete().eq("post_id", postId).eq("user_id", user.id);
      }
    } catch (error) {
      console.error("Error updating like:", error.message);
      setLikes(prevLikes => (increment ? prevLikes - 1 : prevLikes + 1));
    }
  };

  const handleLike = async () => {
    if (!user) {
      console.log("Not authenticated or invalid user data");
      return;
    }

    if (liked) {
      await updateLikesCount(false);
    } else {
      await updateLikesCount(true);
    }

    setLiked(prevLiked => !prevLiked);
  };

  return (
    <button onClick={handleLike} className="likes">
      {liked ? <AiFillHeart color="#22c55e" size={25} /> : <AiOutlineHeart color="white" size={25} />}<span className="ml-3">{likes}</span>
    </button>
  );
}
