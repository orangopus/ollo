import Link from "next/link";

export default function FourOhFour(profile) {
  return (
    <>
      <div className="herocont padd2 center">
        <h1 className="createTitle">Peach is lost in another castle</h1>
        <p className="createText">
          You look like you might have saved the wrong princess, do you wish to
          join the cult?
        </p>
        <Link href="/dashboard">
          <button className="button">Enlist</button>
        </Link>
        <br />
        <br />
        <br />
        <br />
        <p className="text">l̵͚͎͐̒͜͝i̵̢͚͙͋͛͒b̵̢͙͖̿̈́̔b̴̟͇͆̾͜y̸͖̫̾̽͘ i̵̼̪͚͐͛͐s̵̡̼͇̐̈́̈́ e̵̠͉̘̓̈́̈́v̸͙̘͐̒̕͜i̵̡̼͇̿͊̽l̵̢̻̦̓͐͝ d̴̡̺͇̾́́o̴̙͇͕͋̐̽n̴͕͕̟̐͊'̵͓̞̞̒͊͐t̵̟̞͖͌͒͋ s̴͇͉̓̀̿͜i̵͔͓̟̽̈́g̸̝̞̘̈́̔͒ǹ̵͎̻͔͆͆ u̸͕̼̟̔̒́ṕ̸͎̘̚̚</p>
      </div>
    </>
  );
}
