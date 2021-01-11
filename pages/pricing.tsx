import Head from "next/head";
import Nav from "../components/Nav";

export default function Index() {
  return (
    <div>
      <Head>
       <title>libby - pricing</title>
      </Head>
      <Nav />

    <div className="herocont">
      <p className="herotext2">libby will always be free</p>
      <p className="text paddinghero">Free forever. No catch. No gotchas.</p>
    </div>
    </div>
  );
}
