import { prisma } from "./db.server";


export async function sendReport(content:string,userId:string) {
  const createReport = await prisma.report.create({ data:{
    content,
    userId
  } });
  return createReport;
}