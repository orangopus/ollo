import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    const res = await prisma.posts.create({
        data: {
            content: body.content,
            user_id: body.user_id
        }
    })

    return res;
})   