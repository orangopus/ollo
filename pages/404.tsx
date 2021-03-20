import Link from "next/link";

export default function FourOhFour() {
  return (
    <>
      <div className="herocont padd2 center">
        <h1 className="createTitle text-4xl">
          Peach is lost in another castle
        </h1>
        <p className="createText text-1xl mt-2">
          You look like you might have saved the wrong princess, do you wish to
          join the cult?
        </p>
        <Link href="/dashboard">
          <button className="button">Enlist</button>
        </Link>
      </div>
    </>
  );
}
