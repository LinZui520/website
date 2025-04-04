
type Props = {
  label: string;
  onClick?: () => void;
  className?: string;
};

const FontButton = (props: Props) => {

  return (
    <div
      className={'cursor-pointer text-mint-950 dark:text-mint-50 select-none group ' + props.className}
      key={props.label}
      onClick={props.onClick}
    >
      <span>{props.label}</span>
      <div
        className={'w-full h-px origin-right group-hover:origin-left transition-transform scale-x-0 group-hover:scale-x-100 duration-500 bg-mint-950 dark:bg-mint-50'}
      />
    </div>
  );
};

export default FontButton;
