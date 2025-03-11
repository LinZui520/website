import Button from '../../components/Button.tsx';

const Page = () => {
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center">
      <Button onClick={() => console.log('666')}>show</Button>
    </div>
  );
};

export default Page;
