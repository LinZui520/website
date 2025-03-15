import { ChangeEvent, ForwardedRef, forwardRef, useState } from 'react';

type Props = {
  label: string;
  autoComplete: string;
  type: string;
  value: string;
  name: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  className?: string;
};

const Input = forwardRef((props: Props, ref: ForwardedRef<HTMLDivElement>) => {
  const [isFocus, setIsFocus] = useState(false);
  return (
    <div
      className={'relative flex flex-col items-center text-mint-950 dark:text-mint-50 ' + props.className}
      ref={ref}
    >
      <label
        className={
          `absolute left-[12.5%] top-3 transition-all duration-300 select-none ` +
          `${props.value || isFocus ? 'text-sm -translate-y-5 scale-75 text-mint-500' : 'text-base'}`
        }
        htmlFor={props.label}
      >
        {props.label}
      </label>
      <input
        autoComplete={props.autoComplete}
        className={'focus:outline-none focus-visible:outline-none focus:ring-0 h-12 w-3/4'}
        id={props.label}
        name={props.name}
        onBlur={() => setIsFocus(false)}
        onChange={props.onChange}
        onFocus={() => setIsFocus(true)}
        required={true}
        type={props.type}
        value={props.value}
      />
      <div className={'w-full relative after:absolute after:left-0 after:bottom-0 after:right-0 after:w-full after:h-px after:bg-mint-950 dark:after:bg-mint-50'}></div>
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
