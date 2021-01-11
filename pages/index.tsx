import Head from "next/head";
import Nav from "../components/Nav";
import { signIn, signOut, useSession } from "next-auth/client";
import Router , {useRouter}  from 'next/router';

const Index = () => {
  const [session, loading] = useSession();
  if (session) {
    return (
      
      <div>
      <Head>
      <title>libby - dashboard</title>
     </Head>
     <Nav />
   <div className="herocont">
     <div className="login">
      <div className="middle">
      <img className="avatar" src={session.user.image} />

       </div> 
     <p className="username">{session.user.name}</p>
     <p className="bio">Inputting your information doesn't work yet! We're still coming up with a solution for that.</p>
     <div className="middle">
     <input className="input" placeholder="Bio"></input>
     <button onClick={() => signIn()} className="button buttonmargin">Save</button>
     </div>
     </div>
     </div>
     </div>
    );
  } else {
    return (
      <div>
      <Head>
       <title>libby</title>
      </Head>
      <Nav />
    <div className="herocont">
    <div className="row heropadding">
          <div className="col-6 col-sm-6">
          <p className="herotext padding">Branded profiles for
          <br/>creators and beyond.</p>
      <button onClick={() => signIn()} className="button">Get started</button>
          </div>
          <div className="col-6 col-sm-6 right">
            <img className="profile" src="profile.svg"/>
          </div>
        </div>
        </div>
        <div className="row">
          <div className="container">
          <p className="herotext center">Customise Profile</p>
          <img className="center card" src="profilecard.png" />
          </div>
         </div>
        </div>
    );
  }
}


export default Index;
