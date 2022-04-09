import Head from "next/head";
import Link from "next/link";
import Nav from "../components/Nav";

export default function Index() {
  return (      
    <div>
      <Head>
        <title>ollo Pro</title>
      </Head>
      <Nav/>

      <div className="">
        <div className="">
          <img className="proimage" src="logo.svg" />
          <h1 className="subtitle">Want to support ollo's development?</h1>
          <p className="subtext">
            Our core features will always be 100% free, but consider supporting
            our cause. You'll unlock some awesome perks!
          </p>
          <a
            target="_blank"
            href="https://opencollective.com/orangopus/contribute/ollo-pro-24673"
          >
            <button className="mb-5 mt-5 button">Upgrade</button>
          </a>
        </div>
      </div>
      <div className="center">
        <img className="center" src="properks.svg" />
      </div>
    </div>
  );
}
