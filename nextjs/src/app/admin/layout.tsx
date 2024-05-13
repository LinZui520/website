import React from "react";
import Navigation from "@/components/Navigation";
import { Divider } from "@nextui-org/divider";

const Layout = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return (
    <>
      <Navigation />
      <Divider className={"w-full h-[2px]"} />
      <div className={"h-calc-84 w-full"}>{children}</div>
    </>
  )
}

export default Layout;
