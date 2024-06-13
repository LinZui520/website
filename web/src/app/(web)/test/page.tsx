'use client'

import request from "@/lib/axios";

const Page = () => {

  const test = () => {
    request({
      url: '/blog',
      method: 'POST',
      data: {
        title: 'test',
        content: 'test',
      }
    }).then(() => {})
  }

  return (
    <div className={"h-screen w-full flex justify-center items-center"}>
      <button onClick={() => test()}>test</button>
    </div>
  );
}

export default Page;
