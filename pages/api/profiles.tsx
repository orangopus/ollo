import { supabase } from "../../utils/initSupabase";

export default async function handler(req, res) {
  const { body, error } = await supabase.from("profiles").select("*");
  res.status(200).json({ body });
}
