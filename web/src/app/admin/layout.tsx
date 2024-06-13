import React from "react";
import Navigation from "@/components/admin/Navigation";
import { Divider } from "@nextui-org/divider";
import { auth } from "@/lib/auth";
import NotFound from "@/app/not-found";

const Layout = async ({
  children,
}: {
  children: React.ReactNode
}) => {

  const session = await auth()

  if (!session || !session.user) return <NotFound />

  return (
    <>
      <Navigation />
      <Divider className={"w-full h-[2px]"} />
      {children}
    </>
  )
}

export default Layout;
