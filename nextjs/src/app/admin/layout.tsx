import React from "react";


const Layout = ({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode
}) => {
  return (
    <>
      <div>hello</div>
      {children}
    </>
  )
}

export default Layout;
