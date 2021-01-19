import Head from "next/head";
import { PrismaClient } from '@prisma/client';
import Nav from '../components/Nav'

const prisma = new PrismaClient();

export async function getServerSideProps({ params }) {
  const users = await prisma.user.findFirst({
    where: {
      name: params.username.toString()
    }
  })
  console.log(users)
  return {
    props: { users }
  }
}

export default function UserPage({ users }) {
  return (
    <>
      <Head>
        <title>{users.name}</title>
      </Head>
      <Nav />
      <div key={users.id}>
        <img className="avatar" src={users.image} />
        <h1>{users.name}</h1>
      </div>
    </>
  )
}
