type Props = {
  className?: string;
};

const Logo = (props: Props) => {

  return (
    <div className={`${props.className || ''} flex flex-col items-center justify-center font-serif`}>
      <span className="text-3xl text-mint-950 dark:text-mint-50">
        ZhuGui
      </span>
      <span className="text-base text-mint-500 line-through">shi hun dan</span>
    </div>
  );
};

export default Logo;
