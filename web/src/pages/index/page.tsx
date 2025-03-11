
const Page = () => {

  return (
    <div className="h-[300vh] bg-mint-50 dark:bg-mint-950 w-screen flex flex-col items-center">
      {Array.from(Array(22).keys()).map((_, i) => (
        <div className={'mt-12 text-mint-500'} key={i}>
          <span className={'text-lg'}>正文</span>
        </div>
      ))}
    </div>
  );
};

export default Page;
