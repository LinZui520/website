import React from "react";
import { auth } from "@/lib/auth";
import NotFound from "@/app/not-found";
import type {Metadata} from "next";

export const metadata: Metadata = {
  title: "我不吃牛肉",
  description: "一个简约风格的网站",
};

const Layout = async ({
  children
}: {
  children: React.ReactNode
}) => {

  const session = await auth()

  if (!session || !session.user) return <NotFound />

  return <>{children}</>
}

export default Layout;
