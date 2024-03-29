import Head from "next/head";
import Nav from "../components/Nav";

export default function Index() {
  return (
    <div>
      <Head>
        <title>ollo | Privacy Policy</title>
      </Head>
      <div className="herocont">
        <div className="inner" style={{ textAlign: "left", width: "700px" }}>
          <h2 className="mb-4 font-bold text-2xl">Privacy Policy</h2>
          <p className="mb-2">
            Your privacy is important to us. It is ollo's policy to respect
            your privacy regarding any information we may collect from you
            across our website, <a href="http://ollo.fyi">ollo.fyi</a>,
            and other sites we own and operate.
          </p>
          <p className="mb-2">
            We only ask for personal information when we truly need it to
            provide a service to you. We collect it by fair and lawful means,
            with your knowledge and consent. We also let you know why we’re
            collecting it and how it will be used.
          </p>
          <p className="mb-2">
            We only retain collected information for as long as necessary to
            provide you with your requested service. What data we store, we’ll
            protect within commercially acceptable means to prevent loss and
            theft, as well as unauthorized access, disclosure, copying, use or
            modification.
          </p>
          <p className="mb-2">
            We don’t share any personally identifying information publicly or
            with third-parties, except when required to by law.
          </p>
          <p className="mb-2">
            Our website may link to external sites that are not operated by us.
            Please be aware that we have no control over the content and
            practices of these sites, and cannot accept responsibility or
            liability for their respective privacy policies.
          </p>
          <p className="mb-2">
            You are free to refuse our request for your personal information,
            with the understanding that we may be unable to provide you with
            some of your desired services.
          </p>
          <p className="mb-2">
            Your continued use of our website will be regarded as acceptance of
            our practices around privacy and personal information. If you have
            any questions about how we handle user data and personal
            information, feel free to contact us.
          </p>
          <p className="pb-20">
            This policy is effective as of{" "}
            <span className="font-bold">8 January 2021</span>.
          </p>
        </div>
      </div>
    </div>
  );
}
