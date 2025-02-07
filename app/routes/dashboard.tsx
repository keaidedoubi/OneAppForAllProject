import { Button, Card, Pagination, ScrollShadow, Textarea } from "@heroui/react";
import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import SideBar from "~/components/SideBar";
import { adminGetReports } from "~/services/report.server";
import { getUserFromCookie } from "~/services/session.server";

type loaderdata = {
    allReports:Array<any> ,
    totalReports:number
}


export default function dashboard(){
    const loaderData = useLoaderData<loaderdata>();;
    const [currentPage, setCurrentPage] = useState(1);
    const [text, setText] = useState("");

    // const reportsCardRender 

    return(
        <div className="min-w-[480px] min-h-[780px] flex flex-col w-screen h-screen text-center">
            <div className="grid grid-rows-5 grid-cols-6 h-full">
                <SideBar username={""} userId={0}  />
                <div className="col-start-2 col-span-5 row-start-1 row-span-5">
                <ScrollShadow className=" w-4/5 m-auto max-h-[500px]">
                <div className="w-4/5 m-auto">
                { !loaderData.allReports ? (<p>Loading...</p>) : (
                    Array.from({ length: 10 }).map((_, i) => {
                    const report = loaderData.allReports[(currentPage - 1) * 10 + i];
                    return report ? (
                        <Card key={i} className="my-4">
                            <p>{report.id}</p>
                            <p>{report.status}</p>
                            {report.userId}
                            {report.content}
                            <Form>
                                <div>
                                <Textarea  labelPlacement="outside" //label="Description"
                                    placeholder="Enter your description" variant="bordered" name="content" type="text"
                                    className="w-3/5 mx-auto my-2" minRows={1} maxRows={3}
                                    value={text} onValueChange={setText}
                                    />
                                    <Button type="submit" variant="ghost" className="w-24 m-auto">提交</Button>
                                </div>
                            </Form>
                        </Card>
                    ) : null; }
                ))}
                <Pagination loop showControls color="secondary" page={currentPage} total={ Math.ceil(loaderData.totalReports/10) } onChange={setCurrentPage} />
                </div>
                </ScrollShadow>
                <Form  method="post">Dashboard
                    <Button type="submit" name="intent" value={111} >Submit</Button>
                </Form>
                </div>
            </div>
        </div>
    )
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const userId = await getUserFromCookie(request);
    if(userId == null){ 
        return redirect("/adminLogin"); 
    }
    const allReports = await adminGetReports(userId);
    
    return { allReports:allReports,totalReports:allReports.length};
}

export const action = async ({ request }: LoaderFunctionArgs) => {
    const formData = await request.formData();
    const userId = await getUserFromCookie(request);
    const intent = formData.get("intent");
    if(userId == null){ 
        return redirect("/adminLogin"); 
    }
    const allReports = await adminGetReports(userId);
    return allReports;
}