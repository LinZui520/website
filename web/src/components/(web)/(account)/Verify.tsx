import React, {useState} from "react";
import request from "@/lib/axios";
import {motion} from "framer-motion";
import {Button, Input} from "@nextui-org/react";
import {toast} from "react-toastify";


const Verify = ({
  email, code, setCode
} : {
  email: string
  code: string
  setCode: React.Dispatch<React.SetStateAction<string>>
}) => {

  const [isHovered, setIsHovered] = useState(false)

  const getCode = async () => {
    const res = await request({
      url: `/auth/verify`, method: 'POST', data: {email}
    })
    return res.data.code === 200 ? Promise.resolve(res.data.message) : Promise.reject(res.data.message)
  }

  return (
    <motion.div
      className="h-[50px] w-full"
      initial={{opacity: 0, x: -200}}
      animate={{opacity: 1, x: 0}}
      transition={{duration: 0.618, type: "spring", stiffness: 100, damping: 10, delay: 0.8}}
    >

      <div className="flex flex-row space-x-8 items-center">

        <Input
          type="text" label="验证码" value={code} className="w-[180px]"
          onChange={(e) => setCode(e.target.value)}
          endContent={
            <svg
              xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"
              width="18" height="18"
            >
              <path fill="#1d1d1f" d="M256 0c4.6 0 9.2 1 13.4 2.9L457.7 82.8c22 9.3 38.4 31 38.3 57.2c-.5 99.2-41.3 280.7-213.6 363.2c-16.7 8-36.1 8-52.8 0C57.3 420.7 16.5 239.2 16 140c-.1-26.2 16.3-47.9 38.3-57.2L242.7 2.9C246.8 1 251.4 0 256 0z" />
            </svg>
          }
        />

        <Button
          type="button"
          isIconOnly
          className="bg-[#fbfbfd]"
          onClick={() => toast.promise(getCode, {
            pending: '正在发送验证码',
            success: '发送验证码成功',
            error: {
              render: ({data}: {data: string}) => data,
            }
          })}
        >
          <motion.svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            width="32" height="32"
            animate={isHovered ? "hover" : "none"}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            whileHover={{scale: 1.1}}
            whileTap={{scale: 0.9}}
          >
            <motion.path
              initial={{fill: "#1d1d1f"}}
              variants={{
                hover: { fill: "#11efef" }, none: { fill: "#1d1d1f" }
              }}
              transition={{
                duration: 0.618, type: "spring", stiffness: 100, damping: 10
              }}
              d="M64 112c-8.8 0-16 7.2-16 16v22.1L220.5 291.7c20.7 17 50.4 17 71.1 0L464 150.1V128c0-8.8-7.2-16-16-16H64zM48 212.2V384c0 8.8 7.2 16 16 16H448c8.8 0 16-7.2 16-16V212.2L322 328.8c-38.4 31.5-93.7 31.5-132 0L48 212.2zM0 128C0 92.7 28.7 64 64 64H448c35.3 0 64 28.7 64 64V384c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V128z"
            />
          </motion.svg>
        </Button>


      </div>
    </motion.div>
  );
}

export default Verify;
