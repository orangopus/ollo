import Head from "next/head";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container navbar">
      <a className="navbar-brand" href="/"><img className="small" src="logosmall.png" /></a>
      <form className="form-inline">
      <a href="/privacy">Privacy</a>
      <a href="/terms">Terms</a>
      </form>
      </div>
    </footer>
  )
}

export default Footer;
