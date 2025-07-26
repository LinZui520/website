import { useNavigate } from 'react-router-dom';

const BackArrow = () => {

  const navigate = useNavigate();

  return (
    <svg
      className={'fixed left-12 bottom-8 h-16 w-16 fill-none stroke-3 stroke-mint-950 dark:stroke-mint-50 cursor-pointer'}
      onClick={() => navigate(-1)}
      viewBox="0 0 32 32"
    >
      <path d="M 28 16 L 8 16" />
      <path d="M 16 8 L 8 16 L 16 24" />
    </svg>
  );
};

export default BackArrow;
