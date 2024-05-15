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
    const { data: likes } = await supabase
      .from("likes")
      .select("count(*)", { count: "exact" }) // Count the number of rows
      .eq("post_id", postId)
      .eq("user_id", user.id); // Assuming user is already fetched

    return json({ user, likes: likes[0].count }); // Return the count
  } catch (error) {
    console.error("Error fetching likes:", error.message);
    return json({ user: null, likes: 0 }); // Return 0 in case of error
  }
};

export default function Like({ postId, initialLikes = 0 }: LikeButtonProps) {
  const { supabase } = useOutletContext<SupabaseOutletContext>();
  const user = useLoaderData();

  const [liked, setLiked] = useState<boolean>(false);
  const [likes, setLikes] = useState<number>(initialLikes);

  useEffect(() => {
    const fetchLikes = async () => {
      if (!user) {
        return; // Exit early if user is null or user.id is null
      }

      try {
        const { data: likesData } = await supabase
          .from("likes")
          .select("count(*)", { count: "exact" }) // Count the number of rows
          .eq("post_id", postId)
          .eq("user_id", user.data.user.id);

        const likesCount = likesData.length > 0 ? likesData[0].count : 0;
        setLiked(likesCount > 0);
        setLikes(likesCount); // Set the likes count
      } catch (error) {
        console.error("Error fetching likes:", error.message);
      }
    };

    fetchLikes();
  }, [postId, user]);

  useEffect(() => {
    if (liked) {
      return; // Exit early if already liked
    }

    const fetchLikes = async () => {
      if (!user) {
        return; // Exit early if user is null or user.id is null
      }

      try {
        const { data: likesData } = await supabase
          .from("likes")
          .select("count(*)", { count: "exact" }) // Count the number of rows
          .eq("post_id", postId)
          .eq("user_id", user.data.user.id);

        const likesCount = likesData.length > 0 ? likesData[0].count : 0;
        setLiked(likesCount > 0);
        setLikes(likesCount); // Set the likes count
      } catch (error) {
        console.error("Error fetching likes:", error.message);
      }
    };

    fetchLikes();
  }, [postId, user]);

  const updateLikesCount = async (increment: boolean) => {
    try {
      const updatedLikes = increment ? likes + 1 : Math.max(likes - 1, 0);
      setLikes(updatedLikes); // Update local likes count optimistically

      if (increment) {
        await supabase.from("likes").insert({ post_id: postId, user_id: user.data.user.id });
      } else {
        await supabase.from("likes").delete().eq("post_id", postId).eq("user_id", user.data.user.id);
      }
    } catch (error) {
      console.error("Error updating like:", error.message);
      // Revert local likes count if there is an error
      setLikes(prevLikes => increment ? prevLikes - 1 : prevLikes + 1);
    }
  };

  const handleLike = async () => {
    if (!user) {
      console.log("Not authenticated or invalid user data");
      return;
    }

    if (liked) {
      await updateLikesCount(false); // Remove the like
    } else {
      await updateLikesCount(true); // Add the like
    }

    setLiked(prevLiked => !prevLiked); // Toggle liked state
  };

  return (
    <button onClick={handleLike}>
      {liked ? <AiFillHeart color="#22c55e" size={25} /> : <AiOutlineHeart color="white" size={25} />}
      {likes}
    </button>
  );
}