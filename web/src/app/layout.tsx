import type { Metadata } from "next";
import React from "react";
import LocalFont from "next/font/local"
import "./globals.css";
import { SessionProvider } from 'next-auth/react'
import { NextUIProvider } from "@nextui-org/react";
import ArrowUp from "@/components/ArrowUp";
import Menu from "@/components/Menu";
import DynamicGlobalScrollBar from "@/components/DynamicGlobalScrollBar";

const font = LocalFont({
  src: "../assets/fonts/JetBrainsMono-Medium.ttf"
})

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
      <body className={font.className}>
        <NextUIProvider>
          <SessionProvider>
            <Menu />
            {children}
            <DynamicGlobalScrollBar />
            <ArrowUp />
          </SessionProvider>
        </NextUIProvider>
      </body>
    </html>
  );
}

export default RootLayout;
