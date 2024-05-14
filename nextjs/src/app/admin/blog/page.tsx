'use client'

import React, { useCallback, useEffect, useState } from "react";
import request from "@/lib/axios";
import { Blog } from "@/app/api/blog/route";
import Image from "next/image";
import { format } from "@/utils/time";
import {Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip} from "@nextui-org/react";
import Loading from "@/app/loading";


const Page = () => {

  const [blogs, setBlogs] = useState<Blog[]>([])


  const fetchBlogs = useCallback(() => {
    request({
      url: '/blog',
      method: 'GET',
    }).then(res => setBlogs(res.data.data))
  }, [])

  useEffect(() => {
    fetchBlogs()
  }, [fetchBlogs])

  const renderCell = useCallback((blog: Blog, columnKey: React.Key) => {
    switch (columnKey) {
      case "author":
        return <div className={"relative flex items-center gap-2"}>
          <Image
            className={"rounded-full object-cover h-[24px] w-[24px]"}
            height={24} width={24} alt={""}
            src={`https://www.zhuguishihundan.cn/image/${blog.User.avatar}`}
          />
          {blog.User.username}
        </div>
      case "title":
        return <div>{blog.title}</div>
      case "create":
        return <span>{format(new Date(blog.create))}</span>
      case "actions":
        return <div className={"relative flex items-center gap-2"}>
          <Tooltip content="删除">
            <svg
              xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"
              width="18" height="18"
              className={"cursor-pointer active:opacity-50"}
            >
              <path
                d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"
              />
            </svg>
          </Tooltip>

          <Tooltip content="修改">
            <svg
              xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"
              width="18" height="18"
              className={"cursor-pointer active:opacity-50"}
            >
              <path
                d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z"
              />
            </svg>
          </Tooltip>

          <Tooltip content="查看">
            <svg
              xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"
              width="18" height="18"
              className={"cursor-pointer active:opacity-50"}
            >
              <path
                d="M249.6 471.5c10.8 3.8 22.4-4.1 22.4-15.5V78.6c0-4.2-1.6-8.4-5-11C247.4 52 202.4 32 144 32C93.5 32 46.3 45.3 18.1 56.1C6.8 60.5 0 71.7 0 83.8V454.1c0 11.9 12.8 20.2 24.1 16.5C55.6 460.1 105.5 448 144 448c33.9 0 79 14 105.6 23.5zm76.8 0C353 462 398.1 448 432 448c38.5 0 88.4 12.1 119.9 22.6c11.3 3.8 24.1-4.6 24.1-16.5V83.8c0-12.1-6.8-23.3-18.1-27.6C529.7 45.3 482.5 32 432 32c-58.4 0-103.4 20-123 35.6c-3.3 2.6-5 6.8-5 11V456c0 11.4 11.7 19.3 22.4 15.5z"
              />
            </svg>
          </Tooltip>
        </div>
    }
  }, [])

  const columns = [
    {name: "作者", uid: "author"},
    {name: "标题", uid: "title"},
    {name: "创建时间", uid: "create"},
    {name: "操作", uid: "actions"}
  ];

  if (!blogs || !blogs.length) return <Loading/>

  return (
    <Table
      isHeaderSticky
      className={"h-full w-full select-none"} aria-label="Users"
    >
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"}>
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody items={blogs}>
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
