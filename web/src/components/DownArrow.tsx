import { useScrollContext } from '../contexts/ScrollProvider';

type Props = {
  className?: string;
};

const DownArrow = (props: Props) => {
  const { scrollTo } = useScrollContext();

  return (
    <div
      className={'h-16 w-16 overflow-hidden cursor-pointer ' + props.className}
      onClick={() => scrollTo(document.body.scrollHeight)}
    >
      <svg
        className="h-16 w-16 fill-none stroke-3 stroke-mint-950 dark:stroke-mint-50"
        viewBox="0 0 32 32"
      >
        <path d="M 16 4 L 16 24" />
        <path d="M 8 16 L 16 24 L 24 16" />
      </svg>
    </div>
  );
};

export default DownArrow;
