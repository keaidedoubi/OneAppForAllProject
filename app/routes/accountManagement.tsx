import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/react";
import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { col } from "framer-motion/client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import SideBar from "~/components/SideBar";
import { getAllUserInfo } from "~/services/accountManagement";
import { getUserFromCookie } from "~/services/session.server";
import { checkIfAdmin } from "~/services/user.server";

type User = {
  id:string,
  username:string,
  userGroup:number,
  reports:Array<any>
}
type VisibleColumns = Set<string> | "all";

const INITIAL_VISIBLE_COLUMNS = ["id", "username", "userGroup", "reports" , "actions"];
export const columns = [
  { name:"ID",uid:"id",sortable:true} ,
  { name:"USERNAME",uid:"username",sortable:true},
  // { name:"PASSWORD",uid:"password" },
  { name:"USERGROUP",uid:"userGroup",sortable:true},
  { name:"REPORTS",uid:"reports" },
  { name: "ACTIONS", uid: "actions" },
]

export default function accountManagement() {
  const [selectedKeys, setSelectedKeys] = useState();
  const loaderData:Array<any> = useLoaderData();
  const [visibleColumns, setVisibleColumns] = React.useState<VisibleColumns>(
    new Set(INITIAL_VISIBLE_COLUMNS), // 或者 "all"
  );
  useEffect(()=>{
    console.log(loaderData)
  })
  const renderCell = useCallback((user: User, columnKey: React.Key) => {
    console.log(user);
    console.log(columnKey)
    const cellValue = user[columnKey as keyof User];
    switch (columnKey) {
      case "id":
        return(
          <div>
            <p>{cellValue}</p>
          </div>
        );
      case "username":
        return (
          <div>
          <p>{cellValue}</p>
          {/* <p>{user.username}</p> */}
          </div>
        );
      case "userGroup":
        return (
          <div>
            {user.userGroup}
          </div>
      );
      case "reports":
        return(
          <div>
            {user.reports}
          </div>
      );
      case "actions":
        return (
          <div className="relative flex justify-end items-center gap-2">
            {/* <Dropdown className="bg-background border-1 border-default-200">
              <DropdownTrigger>
                <Button isIconOnly radius="full" size="sm" variant="light">
                  <VerticalDotsIcon className="text-default-400" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem key="view">View</DropdownItem>
                <DropdownItem key="edit">Edit</DropdownItem>
                <DropdownItem key="delete">Delete</DropdownItem>
              </DropdownMenu>
            </Dropdown> */}
          </div>
        );
      default:
        return cellValue;
    }
   }, []);

  
  const headerColumns = useMemo(() => {
    if (visibleColumns === "all") {
      return columns; // 如果 visibleColumns 是 "all"，返回所有列
    }
    // 如果 visibleColumns 是 Set<string>，过滤列
    return columns.filter((column) => visibleColumns.has(column.uid));
  }, [visibleColumns, columns]);

  return (
    <div className="min-w-[480px] min-h-[780px] flex flex-col w-screen h-screen text-center">
      <div className="grid grid-rows-5 grid-cols-6 h-full">
        <SideBar username={"11"} userId={0} />

        <div className="col-start-2 col-span-5 row-start-1 row-span-5">
          <Table 
            isCompact
            removeWrapper
            bottomContent={<div>111</div>}
            className="w-64 m-12"
             >
          <TableHeader columns={headerColumns}>
          {(column) => (
            <TableColumn key={column.uid} allowsSorting={column.sortable}>
            {column.name}
            </TableColumn>
          )}
          </TableHeader>
          <TableBody emptyContent={"No users found"} items={loaderData}>
          {(item) => ( 
            <TableRow key={item.id}>
              {(columnKey) => <TableCell>{renderCell(item,columnKey)}</TableCell>}
            </TableRow>
          )}
          </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await getUserFromCookie(request);
  if(userId == null || !checkIfAdmin(userId)){
    return redirect("/login")
  }
  const allUsers = await getAllUserInfo();
  return allUsers;
}


