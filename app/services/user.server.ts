import { createCookie, createCookieSessionStorage, SessionData } from "@remix-run/node";
import { prisma } from "./db.server";

export async function checkIfAdmin(userId:string){
    await prisma.report.findFirst({ where:{ userId } })
    .then(( userGroup:any )=>{
        if( userGroup == 0 ){
            return true;
        }
        else { return false; }
   });
}

export async function checkLogin( formData:any ){
    let res = false;
    const id = formData.get('id');
    const returnInfo = { isAdmin:false }
    await prisma.user.findUnique({ where:{ id } })
    .then(( userInfo:any )=>{
        if( userInfo.Password == formData.get('password') ){
            res = true;
        }
   });
   return res;
}

export const userCookie = createCookie("user", {
    httpOnly: true, // 防止客户端 JavaScript 访问
    secure: process.env.NODE_ENV === "production", // 在生产环境中启用 HTTPS
    sameSite: "lax", // 防止 CSRF 攻击
    maxAge: 60 * 60 * 24 * 7, // Cookie 有效期（7 天）
    path: "/", // Cookie 的作用路径
    secrets: ["s3cr3t"], // 用于签名和验证 Cookie 的密钥
  });

  // 配置会话存储
const { getSession, commitSession, destroySession } =
    createCookieSessionStorage({
      cookie: {
        name: "remix-session", // Cookie 名称
        httpOnly: true, // 防止客户端 JavaScript 访问
        secure: process.env.NODE_ENV === "production", // 仅在生产环境中使用 HTTPS
        secrets: ["s3cret1"], // 加密密钥
        sameSite: "lax", // 防止 CSRF 攻击
        path: "/", // Cookie 路径
        maxAge: 60 * 60 * 24 * 7, // 会话有效期（7 天）
      },
});
export { getSession, commitSession, destroySession };