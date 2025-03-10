import Menu from '../../components/Menu.tsx';
import Footer from '../../components/Footer.tsx';

const Page = () => {

  return (
    <div className="h-[300vh] w-screen flex flex-col items-center font-mono">
      <Menu />
      {Array.from(Array(30).keys()).map((_, index) => (
        <p className={'mt-10'} key={index}>666 {index}</p>
      ))}
      <Footer />
    </div>
  );
};

export default Page;
