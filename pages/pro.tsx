import Head from "next/head";
import Nav from "../components/Nav";
import Link from "next/link";

export default function Index() {
  return (
    <div>
      <Head>
       <title>libby Pro</title>
      </Head>
    <div className="row procont">
    <div className="col-9">
      <img className="proimage" src="pro.png" />
      <h1 className="subtitle">Want to support libby's development?</h1>
      <p className="subtext">Our core features will always be 100% free, but consider supporting our cause. You'll unlock some awesome perks!</p>
      <Link href="https://opencollective.com/orangopus/contribute/libby-pro-24673">
      <button className="button">Upgrade</button>
      </Link>
    </div>
    <div className="col-3">
      <img src="unlock.png" />
    </div>
    </div>
    <div className="row procont paddingcards paddinghero">
      <div className="col-6">
        <div className="cards">
          <div className="row">
          <div className="col-3">
            <img className="probadge" src="probadge.png"/>
          </div>
          <div className="col-9">
          <h1 className="cardtitle">Support the development</h1>
          <p className="cardtext">Keep the developers lights on. Cop a pro badge!</p>
          </div>
          </div>
        </div>
      </div>
      <div className="col-6">
        <div className="cards">
        <div className="row">
          <div className="col-3">
            <img className="probadge" src="sparkles.png"/>
          </div>
          <div className="col-9">
          <h1 className="cardtitle">Early Access</h1>
         <p className="cardtext">Want to try out super early features?</p>

          </div>
          </div>
        </div>
        </div>
        </div>
    </div>
  );
}
