import { ReactNode } from 'react';

type ButtonProps = {
  children: ReactNode;
  onClick?: () => void;
};

const Button = (props: ButtonProps) => {

  return (
    <button className="text-mint-800 hover:text-mint-950 lg:text-9xl md:text-xl " onClick={props.onClick}>{props.children}</button>
  );
};

export default Button;
