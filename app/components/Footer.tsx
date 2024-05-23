import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";

library.add(fab, fas);

const Footer = () => {
  return (
    <div className="min-h-screen">
      <footer className="footer">
        <div className="footercontainer flex justify-between navbar navpad">
          <div>
            <p>
              <a
                className="orangopus"
                href="https://orangop.us"
                target="_blank"
              >
                <img className="orangopus" src="../orangopus.png" /> Orangopus
                Initiative
              </a>{" "}
              licensed under{" "}
              <a
                className="font-black"
                href="https://github.com/orangopus/ollo/blob/main/LICENSE"
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
              href={`https://twitter.com/ollobio`}
              target="_blank"
            >
              <FontAwesomeIcon icon={["fab", "twitter"]} />
            </a>
            <a
              className="footersocial"
              href={`https://go.orangop.us/discord`}
              target="_blank"
            >
              <FontAwesomeIcon icon={["fab", "discord"]} />
            </a>
          </div>
        </div>
        <hr className="footersep" />
        <div className="footercontainer flex justify-between navbar navpad">
          <a className="navbar-brand" href="/">
            <img className="small" src="../logo.svg" />
          </a>
          <form className="form-inline">
            <a
              target="_blank"
              className="footerlinks"
              href="https://github.com/orangopus/ollo"
            >
              Open-source ❤️
            </a>
            <a
              target="_blank"
              className="footerlinks"
              href="https://status.orangop.us"
            >
              Status
            </a>
            <a
              target="_blank"
              className="footerlinks"
              href="https://feedback.orangop.us/ollo"
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
    </div>
  );
};

export default Footer;