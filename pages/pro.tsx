import Head from "next/head";
import Link from "next/link";

export default function Index() {
  return (
    <div>
      <Head>
        <title>libby Pro</title>
      </Head>
      <div className="row herocont">
        <div className="center">
          <img className="center proimage" src="pro.png" />
          <h1 className="subtitle">Want to support libby's development?</h1>
          <p className="subtext">
            Our core features will always be 100% free, but consider supporting
            our cause. You'll unlock some awesome perks!
          </p>
          <a
            target="_blank"
            href="https://opencollective.com/orangopus/contribute/libby-pro-24673"
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
