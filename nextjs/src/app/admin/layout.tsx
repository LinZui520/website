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
      {children}
    </>
  )
}

export default Layout;
