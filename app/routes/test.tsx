import {
    StreamCall,
    StreamVideo,
    StreamVideoClient,
    User,
  } from '@stream-io/video-react-sdk';
  import createServerSupabase from 'utils/supabase.server';
  import { LoaderFunction, redirect } from '@remix-run/node';
  import MyVideoUI from '~/components/MyVideoUI';
import { useLoaderData } from '@remix-run/react';
  
export const loader: LoaderFunction = async ({ request }) => {
    const response = new Response();
    const supabase = createServerSupabase({ request, response });
  
    const { data: user, error } = await supabase.auth.getUser();

    if (error || !user) {
        throw redirect('/login');
    }

    const apiKey = 'qxhh2h2czs7x';
    const token = 'ayvnq9q2rzc6q34vy69d8cwyhengbz9pwnwkttesngy7jd2vxrk7zbrjuvbh7e3uc';
    const streamUser: User = { id: user.user.id, name: "Cheese" }; // Correctly accessing user ID here

    const client = new StreamVideoClient(token, apiKey); // Remove the third argument
    const call = client.call('default', 'my-first-call');
    
    client.connectUser(streamUser);
    await call.join({ create: true });
  
    return { user, client, call };
};

  
  export default function MyApp() {
    const { user, client, call } = useLoaderData();
    return (
      <StreamVideo client={client}>
        <StreamCall call={call}>
          <MyVideoUI />
        </StreamCall>
      </StreamVideo>
    );
  };
  