import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';
import { createComment, deleteComment, readComment } from './api';
import { useRequest } from '../../../hooks/useRequest';
import { CommentVO } from './type';
import UpArrow from '../../../components/UpArrow';
import DownArrow from '../../../components/DownArrow';
import BackArrow from '../../../components/BackArrow';
import CommentInput from '../../../components/comment/CommentInput';
import CommentList from '../../../components/comment/CommentList';
import { useScrollContext } from '../../../contexts/ScrollProvider';
import { OutletContext } from '../type';

const Page = () => {
  const { id } = useParams();
  const { boards } = useOutletContext<OutletContext>();
  const [parentComment, setParentComment] = useState<CommentVO | null>(null);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<CommentVO[]>([]);
  const { handleRequest, notify } = useRequest();
  const { scrollTo } = useScrollContext();

  const board = boards.find(item => item.board_id === id);

  const initComment = useCallback(() => {
    setComment('');
    setParentComment(null);
    readComment<CommentVO[]>(id ?? '').then((res) => {
      setComments(res.data.data);
    });
  }, [id]);

  useEffect(() => {
    initComment();
  }, [initComment]);

  const handleDeleteComment = (comment_id: string) => {
    handleRequest(
      () => deleteComment(comment_id),
      () => initComment(),
      undefined,
      undefined
    );
  };

  const handleReloyComment = (comment: CommentVO) => {
    scrollTo(0);
    setParentComment(comment);
  };

  const handleSubmit = () => {
    if (!id || id === '' || comment === '') {
      notify('评论失败 请检查输入');
      return;
    }
    handleRequest(
      () => createComment(comment, id, parentComment?.comment_id ?? null),
      () => initComment(),
      undefined,
      undefined
    );
  };
  return (
    <main className="bg-mint-50 dark:bg-mint-950 text-mint-950 dark:text-mint-50 w-screen min-h-screen flex flex-col items-center pt-16 pb-16">

      <div className="max-w-100 md:max-w-170 lg:max-w-230 w-full px-6 md:px-8">

        {/* Hero Section */}
        <div className="w-full flex flex-col items-center text-center mb-16 md:mb-24">
          <h1
            className="block w-full text-4xl md:text-5xl lg:text-6xl font-serif tracking-tight text-mint-950 dark:text-mint-50 mb-6 cursor-default truncate"
            title={board?.name ?? ''}
          >
            {board?.name}
          </h1>
          <div className="w-auto max-w-full text-xl md:text-2xl text-mint-500 font-light tracking-wide cursor-default group">
            <span className="block w-auto max-w-full truncate" title={board?.description ?? ''}>
              {board?.description}
            </span>
            <div
              className={'w-auto max-w-full h-px origin-right group-hover:origin-left transition-transform scale-x-0 group-hover:scale-x-100 duration-500 bg-mint-950 dark:bg-mint-50'}
            />
          </div>
        </div>
        <CommentInput
          onChange={(event: ChangeEvent<HTMLTextAreaElement>) => setComment(event.target.value)}
          onClick={handleSubmit}
          parentComment={parentComment}
          setParentComment={setParentComment}
          value={comment}
        />
        <CommentList
          comments={comments}
          onDelete={handleDeleteComment}
          onReply={handleReloyComment}
        />

      </div>

      <UpArrow className="fixed right-12 bottom-28" />
      <DownArrow className="fixed right-12 bottom-8" />
      <BackArrow />
    </main>
  );
};

export default Page;
