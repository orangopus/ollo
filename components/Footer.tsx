import Head from "next/head";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

library.add(fab, fas);

const Footer = () => {
  return (
    <>
      <footer className="footer">
        <div className="footercontainer navbar navpad">
          <div>
            <Link href="https://plural.enterprises">
              <a target="_blank">
                <img className="plural" src="../plural.png" />
              </a>
            </Link>
            <p>
              Plural is an open-source CIC subsidary of the{" "}
              <a
                className="orangopus"
                href="https://orangopus.com"
                target="_blank"
              >
                Orangopus Initiative
              </a>{" "}
              licensed under{" "}
              <a
                className="font-black"
                href="https://github.com/pluralui/libby/blob/main/LICENSE"
                target="_blank"
              >
                MIT
              </a>
              .
            </p>
          </div>
          <div>
            <a
              className="footersocial"
              href={`https://twitter.com/libbybio`}
              target="_blank"
            >
              <FontAwesomeIcon icon={["fab", "twitter"]} />
            </a>
            <a
              className="footersocial"
              href={`https://guilded.gg/Orangopus`}
              target="_blank"
            >
              <FontAwesomeIcon icon={["fab", "guilded"]} />
            </a>
          </div>
        </div>
        <hr className="footersep" />
        <div className="footercontainer navbar navpad">
          <a className="navbar-brand" href="/">
            <img className="small" src="../logosmall.png" />
          </a>
          <form className="form-inline">
            <a
              target="_blank"
              className="footerlinks"
              href="https://github.com/pluralui/libby"
            >
              Open-source ❤️
            </a>
            <a
              target="_blank"
              className="footerlinks"
              href="https://status.orangopus.com"
            >
              Status
            </a>
            <a
              target="_blank"
              className="footerlinks"
              href="https://feedback.orangopus.com/libby"
            >
              Feedback
            </a>
            <a className="footerlinks" href="/privacy">
              Privacy
            </a>
            <a className="footerlinks" href="/terms">
              Terms
            </a>
          </form>
        </div>
      </footer>
    </>
  );
};

export default Footer;
