import { LoaderFunctionArgs } from '@remix-run/node';
import supabase from "utils/supabase.server";

// Example of how to verify and get user data server-side.

export async function loader({
    request,
}: LoaderFunctionArgs) {
    const response = new Response();
    const sup = supabase({ request, response });
    const user = await sup.auth.getUser();
    const profile = await sup.from("profiles").select("*").eq("id", user.data.user.id).single();
    return JSON.parse(JSON.stringify(profile.data));
}