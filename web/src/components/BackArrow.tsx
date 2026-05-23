import { useAnimatedNavigateBack } from '../contexts/TransitionProvider';

type Props = {
  onClick?: () => void;
  className?: string;
};

const BackArrow = ({ onClick, className }: Props) => {
  const navigateBack = useAnimatedNavigateBack();

  return (
    <svg
      className={className ?? 'fixed left-12 bottom-8 h-16 w-16 fill-none stroke-3 stroke-mint-950 dark:stroke-mint-50 cursor-pointer'}
      onClick={onClick ?? (() => navigateBack())}
      viewBox="0 0 32 32"
    >
      <path d="M 28 16 L 8 16" />
      <path d="M 16 8 L 8 16 L 16 24" />
    </svg>
  );
};

export default BackArrow;
