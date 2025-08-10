import useAuth from '../../hooks/useAuth';
import { CommentVO } from '../../pages/board/[id]/type';
import CommentItem from './CommentItem';

type Props = {
  comments: CommentVO[],
  onDelete: (comment_id: string) => void,
  onReply: (comment: CommentVO) => void,
  className?: string
};

const CommentList = (props: Props) => {

  const auth = useAuth();

  return (
    <div className={'flex flex-col w-full text-mint-950 dark:text-mint-50 ' + props.className}>
      {props.comments.map((value: CommentVO, index) => (
        <CommentItem
          comment={value}
          index={index}
          key={value.comment_id}
          onDelete={() => props.onDelete(value.comment_id)}
          onReply={() => props.onReply(value)}
          user={auth.state.user}
        />
      ))}
    </div>
  );
};

export default CommentList;
