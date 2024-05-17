import type { Metadata } from "next";
import React from "react";
import "./globals.css";
import { SessionProvider } from 'next-auth/react'
import { NextUIProvider } from "@nextui-org/react";
import ArrowUp from "@/components/ArrowUp";
import Menu from "@/components/Menu";
import ScrollBar from "@/components/ScrollBar";


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
        <NextUIProvider>
          <SessionProvider>
            <Menu />
            {children}
            <ScrollBar />
            <ArrowUp />
          </SessionProvider>
        </NextUIProvider>
      </body>
    </html>
  );
}

export default RootLayout;
