import { createCookie } from "@remix-run/node";
import { prisma } from "./db.server";
import { parse, serialize } from "cookie";

export async function checkLogin( formData:any,intent:any ){
    let res = false;
    let userId = '';
    let find = '';

    if( intent == "idLogin" ){
        const id = formData.get('id');
        await prisma.user.findUnique({ where:{ id } })
        .then(( userInfo:any )=>{
            if( userInfo.Password == formData.get('password') ){
                res = true;
                userId = id
            }
       });  
    }
    else if( intent == "usernameLogin" ){
        const username = formData.get('username');
        await prisma.user.findUnique({ where:{ username } })
        .then(( userInfo:any )=>{
            if( userInfo.Password == formData.get('password') ){
                res = true;
                userId = userInfo.id
            }
       });  
    }
   return { res:res, userId:userId };
}


export const userCookie = createCookie("user", {
    httpOnly: true, // 防止客户端 JavaScript 访问
    secure: process.env.NODE_ENV === "production", // 在生产环境中启用 HTTPS
    sameSite: "lax", // 防止 CSRF 攻击
    maxAge: 60 * 60 * 24 * 7, // Cookie 有效期（7 天）
    path: "/", // Cookie 的作用路径
    secrets: ["s3cr3t"], // 用于签名和验证 Cookie 的密钥,
});

export async function getUserFromCookie(request: Request) {
    const cookieHeader = request.headers.get("Cookie");
    if (!cookieHeader) return null;
    const cookie = await userCookie.parse(request.headers.get("Cookie"));
    const userId = cookie?.userId;
    return userId
}