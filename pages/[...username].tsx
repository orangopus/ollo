import Head from "next/head";
import { PrismaClient } from '@prisma/client';
import Nav from '../components/Nav.tsx'

const prisma = new PrismaClient();

export async function getServerSideProps({ params }) {
const users = await prisma.user.findFirst({
  where: { 
    name: params.username.toString(),
    createdAt: new Date()
  }
})

return {
  props : { users }
}
}

export default function UserPage(users){
  if (users) {
    return (
      <>
        <Head>
        <title>{users.name}</title>
        </Head>
        <Nav />       
        <div key={users.id}>
        <h1>{users.name}</h1>
        <p>{users.bio}</p>
        </div>
      </>
    )
  } else {
    return (
      <h1>No user found.</h1>
    )
  }
}