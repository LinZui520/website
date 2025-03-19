import useAuth from '../../hooks/useAuth.ts';
import Test from './Test.tsx';

const Page = () => {

  const { state } = useAuth();

  return (
    <main className="h-[500vh] bg-mint-50 dark:bg-mint-950 w-screen flex flex-col items-center">
      {Array.from(Array(5).keys()).map((_, i) => (
        <div className={'mt-12 text-mint-500 bg-amber-100'} key={i}>
          <span className={'text-lg'}>正文</span>
        </div>
      ))}
      <Test />
      {state.user?.email}
    </main>
  );
};

export default Page;
