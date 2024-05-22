import { createBrowserClient } from "@supabase/ssr";

export default ({
  request,
  response,
}: {
  request: Request;
  response: Response;
}) =>
  createBrowserClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
  );