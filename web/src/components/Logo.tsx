type Props = {
  className?: string;
};

const Logo = (props: Props) => {

  return (
    <div className={`${props.className || ''} flex flex-col items-center justify-center`}>
      <span className="text-4xl text-mint-950 dark:text-mint-50">
        ZhuGui
      </span>
      <span className="text-base text-mint-950 dark:text-mint-50">SHI HUN DAN</span>
    </div>
  );
};

export default Logo;
