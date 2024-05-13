import React from "react";
import Navigation from "@/components/Navigation";

const Layout = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return (
    <>
      <Navigation />
      <div className={"h-calc-82 w-full"}>{children}</div>
    </>
  )
}

export default Layout;
