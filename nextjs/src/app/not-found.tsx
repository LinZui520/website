'use server'

const NotFound = async () => {
  return (
    <div className={"h-screen max-h-full w-full bg-[#fbfbfd] flex justify-center items-center"}>
      <span className={"font-mono text-[#1d1d1f] text-[27px]"}>
        404 - Not Found
      </span>
    </div>
  );
}

export default NotFound;
