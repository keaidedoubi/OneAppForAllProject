import { prisma } from "./db.server";


export async function sendReport(content:string,userId:string) {
  const createReport = await prisma.report.create({ data:{
    content,
    userId,
    status: "pending" // or any default status value
  }});
  return createReport;
}

export async function getReports(userId:string) {
  const reports = await prisma.report.findMany({ where:{ userId } });
  return reports;
}

export async function sendReply(content:string,userId:string,reportId:string) {

  const createReply = await prisma.reply.create({ data:{
    content,
    userId,
    reportId
  } });
  return createReply;
}