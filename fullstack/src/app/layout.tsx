import type { Metadata } from "next";
import React from "react";
import "./globals.css";
import Menu from "@/components/Menu";

export const metadata: Metadata = {
  title: "我不吃牛肉",
  description: "一个简约风格的网站",
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="zh-CN">
      <body>
        <Menu />
        {children}
      </body>
    </html>
  );
}

export default RootLayout;
