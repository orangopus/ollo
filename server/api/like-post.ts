import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    const res = await prisma.likes.create({
        data: {
            user_id: body.user_id,
            post_id: body.post_id
        }
    })

    return res;
})   