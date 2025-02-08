import { prisma } from "./db.server";

export async function getAllUserInfo(){
    const allUser = await prisma.user.findMany();
    return allUser;
}