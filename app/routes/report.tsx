import { Button, Card, Form, Textarea } from "@heroui/react";
import { ActionFunction, json, LoaderFunction } from "@remix-run/node";
import { useState } from "react";
import NavBar from "~/components/NavBar";
import { prisma } from "~/services/db.server";

export default function Report() {
  const [text, setText] = useState<string>("");
  
  return (
    <div className="min-w-[480px] min-h-[780px] flex flex-col w-screen h-screen text-center">
      {/* <SideBar/> */}
      <NavBar/>
        <div className="w-full h-full grid grid-rows-8 grid-cols-5 ">
          <Card className="col-start-2 col-span-3 row-start-2 row-span-3">
            <h1 className="my-4">提交反馈</h1>
            <Form method="post">
              <Textarea  labelPlacement="outside" //label="Description"
                placeholder="Enter your description" variant="bordered"
                className="w-3/5 mx-auto" minRows={4} maxRows={5}
                value={text} onValueChange={setText}
              />
              <Button type="submit" variant="ghost" className="w-24 m-auto">提交</Button>
            </Form>
          </Card>
        <h2>我的反馈</h2>
      <ul>
        {/* {Report.map((Report:any) => (
          <li key={Report.id}>
            <p>{Report.content}</p>
            <p>状态: {Report.status}</p>
            <ul>
              {Report.replies.map((reply:any) => (
                <li key={reply.id}>
                  <p>{reply.content} - {reply.isAdmin ? "管理员" : "用户"}</p>
                </li>
              ))}
            </ul>
          </li>
        ))} */}
      </ul>
      </div>
    </div>
  );
}

// export const loader: LoaderFunction = async ({ request }) => {
//     // 获取当前用户的反馈列表
//     const userId = "user-id-from-session"; // 从 session 中获取用户ID
//     const feedbacks = await prisma.report.findMany({
//       where: { userId },
//       include: { replies: true },
//     });
//     return json({ feedbacks });
//   };
  
//   export const action: ActionFunction = async ({ request }) => {
//     const formData = await request.formData();
//     const content = formData.get("content");
//     const userId = "user-id-from-session"; // 从 session 中获取用户ID
  
//     // 创建新的反馈
//     await prisma.report.create({
//       data: {
//         userId,
//         content,
//         status: "pending",
//       },
//     });
  
//     return null;
//   };
  