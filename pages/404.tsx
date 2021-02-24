import Link from 'next/link'

export default function FourOhFour() {
  return <>
  <div className="herocont padd center">
  <h1>404 - Page/Profile Not Found</h1>
    <Link href="/feed">
      <a>
        Go to the feed
      </a>
    </Link>
  </div>
  </>
}