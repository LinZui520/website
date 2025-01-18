import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "高三21班独家回忆",
  description: "一个简约风格的网站",
};

const Layout = async ({
  children,
}: {
  children: React.ReactNode
}) => {
  return (
    <>
      {children}
    </>
  );
}

export default Layout;
