import Head from "next/head";
import { supabase } from '../utils/initSupabase'

export default async function UserPage() {

  const { body, error } = await supabase
  .from('profile')
  .select('*')

  return (
    <>
      <div>Hello</div>
    </>
  )
}


