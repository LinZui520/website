'use client'

import dynamic from "next/dynamic";

const DynamicGlobalScrollBar = dynamic(
  () => import('@/components/GlobalScrollBar'),
  { ssr: false },
);

export default DynamicGlobalScrollBar;
