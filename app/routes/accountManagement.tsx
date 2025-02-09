import { Button, Checkbox, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, form, Input, modal, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, useDisclosure } from "@heroui/react";
import { ActionFunctionArgs, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { col, label } from "framer-motion/client";
import { Archive, MoreHoriz, Plus, ProfileCircle, User, UserScan } from "iconoir-react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import SideBar from "~/components/SideBar";
import { addNewUsers, getAllUserInfo } from "~/services/accountManagement";
import { getUserFromCookie } from "~/services/session.server";
import { checkIfAdmin } from "~/services/user.server";

type User = {
  id: string,
  username: string,
  userGroup: number,
  reports: Array<any>
}
type VisibleColumns = Set<string> | "all";

const INITIAL_VISIBLE_COLUMNS = ["id", "username", "userGroup", "reports", "actions"];
export const columns = [
  { name: "ID", uid: "id", sortable: true },
  { name: "USERNAME", uid: "username", sortable: true },
  // { name:"PASSWORD",uid:"password" },
  { name: "USERGROUP", uid: "userGroup", sortable: true },
  { name: "REPORTS", uid: "reports" },
  { name: "ACTIONS", uid: "actions" },
];
export const USERGROUP = [
  { key: "0", label: "管理员" },
  { key: "1", label: "用户" },
]

export default function accountManagement() {
  const [newUserId,setNewUserId] = useState<string>('');
  const [newUserUsername,setNewUserUsername] = useState<string>('');
  const [selectUserGroup, setSelectUserGruop] = useState<number>(1);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedKeys, setSelectedKeys] = useState();
  const loaderData: Array<any> = useLoaderData();
  const [visibleColumns, setVisibleColumns] = React.useState<VisibleColumns>(
    new Set(INITIAL_VISIBLE_COLUMNS), // 或者 "all"
  );
  const [modalMode, setModalMode] = useState<any>();//useState<"reset"|"delete"|"add">();

  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [page, setPage] = React.useState(1);
  const onRowsPerPageChange = React.useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);

  useEffect(() => {
    console.log(loaderData)
  })

  //渲染单元格
  const renderCell = useCallback((user: User, columnKey: React.Key) => {
    // console.log(user);
    // console.log(columnKey)
    const cellValue = user[columnKey as keyof User];
    switch (columnKey) {
      case "id":
        return (
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
        return (
          <div>
            {user.reports}
          </div>
        );
      case "actions":
        return (
          <div className="relative flex justify-end items-center gap-2">
            <Dropdown className="bg-background border-1 border-default-200">
              <DropdownTrigger>
                <Button isIconOnly radius="full" size="sm" variant="light">
                  <MoreHoriz className="text-bold-400" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu onAction={(key) => setModalMode(key)}>
                <DropdownItem key="reset">重置密码</DropdownItem>
                <DropdownItem key="edit">编辑用户</DropdownItem>
                <DropdownItem key="delete">删除用户</DropdownItem>
              </DropdownMenu>
            </Dropdown>
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

  //表格上部
  const topContent = useMemo(() => {

    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          {/* <Input
          isClearable
          classNames={{
            base: "w-full sm:max-w-[44%]",
            inputWrapper: "border-1",
          }}
          placeholder="Search by name..."
          size="sm"
          startContent={<SearchIcon className="text-default-300" />}
          value={filterValue}
          variant="bordered"
          onClear={() => setFilterValue("")}
          onValueChange={onSearchChange}
        /> */}
          <div className="flex gap-3">
            {/* <Dropdown>
            <DropdownTrigger className="hidden sm:flex">
              <Button
                endContent={<ChevronDownIcon className="text-small" />}
                size="sm"
                variant="flat"
              >
                Status
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              disallowEmptySelection
              aria-label="Table Columns"
              closeOnSelect={false}
              selectedKeys={statusFilter}
              selectionMode="multiple"
              onSelectionChange={setStatusFilter}
            >
              {statusOptions.map((status) => (
                <DropdownItem key={status.uid} className="capitalize">
                  {capitalize(status.name)}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown> */}
            {/* <Dropdown>
            <DropdownTrigger className="hidden sm:flex">
              <Button
                endContent={<ChevronDownIcon className="text-small" />}
                size="sm"
                variant="flat"
              >
                Columns
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              disallowEmptySelection
              aria-label="Table Columns"
              closeOnSelect={false}
              selectedKeys={visibleColumns}
              selectionMode="multiple"
              onSelectionChange={setVisibleColumns}
            >
              {columns.map((column) => (
                <DropdownItem key={column.uid} className="capitalize">
                  {capitalize(column.name)}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown> */}
            <Button className="bg-foreground text-background" endContent={<Plus />} size="sm" onPress={() => { setModalMode("add"); onOpen }}>
              Add New
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">Total {loaderData.length} users</span>
          <label className="flex items-center text-default-400 text-small">
            Rows per page:
            <select
              className="bg-transparent outline-none text-default-400 text-small"
              onChange={onRowsPerPageChange}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </label>
        </div>
      </div>
    )
  }, [])

  return (
    <div className="min-w-[480px] min-h-[780px] flex flex-col w-screen h-screen text-center">
      <div className="grid grid-rows-5 grid-cols-6 h-full">
        <SideBar username={"11"} userId={0} />
        <div className="col-start-2 col-span-5 row-start-1 row-span-5">
          <Table
            isCompact
            removeWrapper
            selectedKeys={selectedKeys}
            selectionMode="multiple"
            aria-label="Table"
            bottomContent={<div>111</div>}
            className="w-64 m-12"
            topContent={topContent}
            topContentPlacement="outside"
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
                  {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                </TableRow>
              )}
            </TableBody>
          </Table>
          <Button onPress={onOpen}>111</Button>
          <Modal isOpen={isOpen} placement="top-center" onOpenChange={onOpenChange}>
            <ModalContent>
              {(onClose) => (
                (modalMode == "delete") ? (
                  <ModalBody>
                    确认要删除此用户吗？此操作无法撤销。
                  </ModalBody>
                ) : (modalMode == "reset") ? (
                  <ModalBody>
                    确认要重置此用户的密码吗？此操作无法撤销。
                  </ModalBody>
                ) : (modalMode == "add") ? (
                  <>
                  <Form method="post">
                    <ModalHeader className="flex flex-col gap-1">添加用户</ModalHeader>
                    <ModalBody>
                      <Input
                        name="userid"
                        isRequired
                        value={newUserId}
                        onChange={(e)=>setNewUserId(e.target.value)}
                        label="学号"
                        placeholder="用户id（学号）"
                        variant="bordered"
                        endContent={
                          <UserScan/>
                        }
                      />
                      <Input
                        // endContent={
                        //   <ProfileCircle/>
                        // }
                        name="username"
                        value={newUserUsername}
                        onChange={(e)=>setNewUserUsername(e.target.value)}
                        label="用户名"
                        placeholder="可指定用户名，不指定则由系统随机生成"
                        variant="bordered"
                      />
                      <div className="flex py-2 px-1 justify-between">
                        <Select
                          name="usergroup"
                          isRequired
                          className="max-w-xs"
                          // endContent={ <Archive/> }
                          label="请选择用户组"
                          placeholder="选择用户组"
                          selectedKeys={[selectUserGroup]}
                          variant="bordered"
                          onChange={(e: any) => { setSelectUserGruop(e.target.value) }}
                        >
                          {USERGROUP.map((ug) => (
                            <SelectItem key={ug.key}>{ug.label}</SelectItem>
                          ))}
                        </Select>
                      </div>
                    </ModalBody>
                    <ModalFooter>
                      <Button color="danger" variant="flat" onPress={onClose}>
                        取消
                      </Button>
                      <Button type="submit" isDisabled={newUserId=="" || newUserId==null || selectUserGroup==null} color="primary" 
                        name="intent" value={"adduser"} onPress={onClose}>
                        确定
                      </Button>
                    </ModalFooter>
                  </Form>
                  </>
                ) : <></>
              )}
            </ModalContent>
          </Modal>
        </div>
      </div>
    </div>
  )
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await getUserFromCookie(request);
  if (userId == null || !checkIfAdmin(userId)) {
    return redirect("/login")
  }
  const allUsers = await getAllUserInfo();
  return allUsers;
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const userId = await getUserFromCookie(request);
  const formData = await request.formData();
  const intent = formData.get("intent")
  if (userId == null || !checkIfAdmin(userId)) {
    return redirect("/login")
  }
  if(intent === "adduser")
  {
    let users = [{ 
      userId: formData.get('userid'),
      username: formData.get('username'),
      userGroup: Number(formData.get('usergroup')),
      Password: ''
    }]
    await addNewUsers(users);
    console.log(users)
  }
  // console.log(formData)
  // console.log(formData.get("userid"))
  return 0;
}
