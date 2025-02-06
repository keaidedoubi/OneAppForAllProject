import { Button, Card, Form, Textarea, user } from "@heroui/react";
import { ActionFunction, json, LoaderFunction, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { use } from "framer-motion/client";
import { useEffect, useState } from "react";
import NavBar from "~/components/NavBar";
import { prisma } from "~/services/db.server";
import { getReports, sendReport } from "~/services/report.server";
import { getUserFromCookie, userCookie } from "~/services/session.server";

export default function Report() {
  const [text, setText] = useState<string>("");
  const reports  = useLoaderData<Array<Object>>();
//   const [Reports, setReports] = useState<Array<Object>>([]);

//   const [Reports, setReports] = useState<any>();

//   useEffect(() => {
//     if(reports){
//         setReports(reports);
//     }
//   })
    return (
    <div className="min-w-[480px] min-h-[780px] flex flex-col w-screen h-screen text-center">
      {/* <SideBar/> */}
        <NavBar/>
        <div className="w-full h-full grid grid-rows-8 grid-cols-5 ">
            <Card className="col-start-2 col-span-3 row-start-2 row-span-3">
                <div className="m-auto w-full ">
                <h1 className="my-2 text-xl">提交反馈</h1>
                <Form method="post">
                    <Textarea  labelPlacement="outside" //label="Description"
                    placeholder="Enter your description" variant="bordered" name="content" type="text"
                    className="w-3/5 mx-auto" minRows={4} maxRows={5}
                    value={text} onValueChange={setText}
                    />
                    <Button type="submit" variant="ghost" className="w-24 m-auto">提交</Button>
                </Form>
                </div>
            </Card>
            <div className="col-start-2 col-span-3 row-start-6">
                <h2>我的反馈</h2>
                { !reports ? ( 
                    <p>暂无反馈</p>
                ) : ( reports.map((report:any) => (
                    <Card className="my-4 h-24">
                        <p>id:{report.id}</p>
                        <p>内容:{report.content}</p>
                        <p>状态:{report.status}</p>
                        { !report.replies?(<p>暂无回复</p>):(report.replies.map((reply:any) => (
                    <div>
                        <p>{reply.id}</p>
                        <p>{reply.content} - {reply.isAdmin ? "管理员" : "用户"}</p>
                    </div>
                )))}
                    </Card>
                )))
                } 
            </div>
        </div>
    </div>
  );
}

export const loader: LoaderFunction = async ({ request }) => {
    // route protected by user session
    const userId = await getUserFromCookie(request);
    if(userId == null){ 
        return redirect("/login"); 
    }
    const report = await getReports(userId);
    // console.log(report);
    return report;
};
  
export const action: ActionFunction = async ({ request }) => {
    const userId = await getUserFromCookie(request);
    const formData = await request.formData();
    const content = formData.get("content");

    if(userId == null){ 
        return redirect("/login"); 
    }
    if(content != null){
        const res = await sendReport(content as string, userId);
        console.log(res)
    }
    // 创建新的反馈
    // await prisma.report.create({
    //   data: {
    //     userId,
    //     content,
    //     status: "pending",
    //   },
    // });
  
    return null;
};
  