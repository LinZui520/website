'use client'

import { User } from "@/app/api/user/route";
import request from "@/lib/axios";
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip } from "@nextui-org/react";
import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";

function formatTime(isoTime: Date) {
  const date = new Date(isoTime);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day}-${hours}:${minutes}:${seconds}`;
}

const Page = () => {

  const [users, setUsers] = useState<User[]>([])


  useEffect(() => {
    const fetchUsers = async () => {
      const res = await request({
        url: 'http://127.0.0.1:3000/api/user',
        method: 'GET',
      })
      setUsers(res.data.data)
    }

    fetchUsers().then(() => {})
  }, [])

  const renderCell = useCallback((user: User, columnKey: React.Key) => {
    const cellValue = user[columnKey as keyof User]

    switch (columnKey) {
      case "username":
        return <div className={"relative flex items-center gap-2"}>
          <Image
            className={"rounded-full object-cover h-[24px] w-[24px]"}
            height={24} width={24} alt={""}
            src={`https://www.zhuguishihundan.cn/image/${user.avatar}`}  />
          {user.username}
        </div>
      case "email":
        return <div>{user.email}</div>
      case "power":
        return <div>
          {user.power < 0 ? "人下人" : user.power < 1 ? "普通用户" : user.power < 2 ? "管理员" : "站长"}
        </div>
      case "login":
        return <span>{formatTime(new Date(user.login))}</span>
      case "actions":
        return <div className={"relative flex items-center gap-2"}>
          <Tooltip content="降低权限">
            <svg
              xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"
              width="18" height="18"
              className={"cursor-pointer active:opacity-50"}
            >
              <path
                d="M256 0a256 256 0 1 0 0 512A256 256 0 1 0 256 0zM127 281c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l71 71L232 136c0-13.3 10.7-24 24-24s24 10.7 24 24l0 182.1 71-71c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9L273 393c-9.4 9.4-24.6 9.4-33.9 0L127 281z"
              />
            </svg>
          </Tooltip>

          <Tooltip content="增加权限">
            <svg
              xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"
              width="18" height="18"
              className={"cursor-pointer active:opacity-50"}
            >
              <path
                d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM385 231c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-71-71V376c0 13.3-10.7 24-24 24s-24-10.7-24-24V193.9l-71 71c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9L239 119c9.4-9.4 24.6-9.4 33.9 0L385 231z"
              />
            </svg>
          </Tooltip>
        </div>
      default:
        return cellValue
    }
  }, [])

  const columns = [
    {name: "用户名", uid: "username"},
    {name: "邮箱", uid: "email"},
    {name: "权限", uid: "power"},
    {name: "最近登录时间", uid: "login"},
    {name: "操作", uid: "actions"}
  ];

  return (
    <Table
      isHeaderSticky
      className={"h-full w-full"} aria-label="Users"
    >
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"}>
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody items={users}>
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

export default Page;
