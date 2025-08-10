import { useEffect, useState } from 'react';
import { CommentVO } from '../../pages/board/[id]/type';
import { markdown } from '../../utils/markdown';
import { UserVO } from '../../pages/auth/type';

type Props = {
  index: number,
  comment: CommentVO,
  onDelete: () => void,
  onReply: () => void,
  user: UserVO | null,
};

const CommentItem = (props: Props) => {
  const [parentMarkdownText, setParentMarkdownText] = useState<string>('');
  const [markdownText, setMarkdownText] = useState<string>('');

  useEffect(() => {
    markdown(props.comment.content).then(setMarkdownText);
    markdown(props.comment.parent?.content ?? '').then(setParentMarkdownText);
  }, [props.comment.content, props.comment.parent?.content]);

  if (!markdownText) {
    return null;
  }

  return (
    <>
      {/* 评论分隔线 */}
      {props.index ?
        <div className="relative h-4 w-full">
          <div className="w-px h-full bg-mint-500/30 absolute top-0 left-22"></div>
        </div> :
        null
      }

      {/* 评论 */}
      <div className="w-full flex flex-row items-start gap-4">
        <img alt="头像" className="w-10 h-10 rounded-full" src={props.comment.created_by.avatar_url} />
        <div className="w-[calc(100%-56px)] flex flex-col border border-mint-950/20 dark:border-mint-50/20 rounded-md bg-mint-50 dark:bg-mint-950">
          {/* 评论头部 */}
          <div className="w-full flex items-center justify-between px-4 py-2 border-b rounded-t-md border-mint-950/20 dark:border-mint-50/20 bg-mint-100 dark:bg-mint-900 cursor-default">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-mint-950 dark:text-mint-50">
                {props.comment.created_by.username}
              </span>
              <span className="text-sm text-mint-500">
                on {new Date(props.comment.created_at).toLocaleDateString()}
              </span>
            </div>
            <div className="text-sm flex flex-row items-center gap-2">
              {props.comment.created_by.id === props.user?.id || (props.user && props.user?.permission >= 2) ?
                <span
                  className="text-mint-500 hover:text-mint-500/50 cursor-pointer select-none"
                  onClick={() => {
                    if (window.confirm('确定要撤回这条评论吗？此操作无法撤销。')) {
                      props.onDelete();
                    }
                  }}
                >
                  撤回
                </span> :
                null
              }
              {props.user ?
                <span
                  className="text-mint-500 hover:text-mint-500/50 cursor-pointer select-none"
                  onClick={props.onReply}
                >
                  回复
                </span> :
                null
              }
            </div>
          </div>

          {/* 评论内容 */}
          <div
            className="w-full markdown-body pl-4 pr-4 pt-4 rounded-md text-mint-950 dark:text-mint-50 cursor-default"
          >
            {parentMarkdownText ?
              <blockquote className="border-l-4 border-mint-500/50 mb-4">
                <div dangerouslySetInnerHTML={{ __html: parentMarkdownText }} />
              </blockquote> :
              null
            }
            <div dangerouslySetInnerHTML={{ __html: markdownText }} />
          </div>
        </div>
      </div>
    </>
  );
};

export default CommentItem;
