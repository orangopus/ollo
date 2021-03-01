import { supabase } from "../../../utils/initSupabase";

export default async function handler(req, res) {
  const {
    query: { username },
  } = req;

  const { body, error } = await supabase
    .from("profiles")
    .select("*")
    .ilike("username", username)
    .single();

  res.status(200).json(body);
}
