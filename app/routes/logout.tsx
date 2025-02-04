import { ActionFunction, redirect } from "@remix-run/node";
import { userCookie } from "~/services/user.server";


export const action: ActionFunction = async ({ request }) => {
  // 清除 Cookie
  const cookie = await userCookie.serialize("", {
    maxAge: 0, // 设置过期时间为 0，立即失效
  });

  // 重定向到登录页面
  return redirect("/login", {
    headers: {
      "Set-Cookie": cookie,
    },
  });
};