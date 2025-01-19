'use client'

import dynamic from "next/dynamic";

const DynamicScrollBar = dynamic(
  () => import('@/components/ScrollBar'),
  { ssr: false },
);

export default DynamicScrollBar;
