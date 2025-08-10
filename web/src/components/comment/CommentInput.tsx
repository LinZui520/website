import { MouseEvent, ChangeEvent, useState, useEffect, useRef, Dispatch, SetStateAction } from 'react';
import { markdown } from '../../utils/markdown';
import useAuth from '../../hooks/useAuth';
import { CommentVO } from '../../pages/board/[id]/type';

type Props = {
  value: string,
  parentComment: CommentVO | null,
  setParentComment: Dispatch<SetStateAction<CommentVO | null>>,
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void,
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void,
  className?: string
};

const CommentInput = (props: Props) => {
  const auth = useAuth();
  const [isPreview, setIsPreview] = useState(false);
  const [markdownText, setMarkdownText] = useState<string>('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 自动调整 textarea 高度的函数
  const resizeTextareaHeight = async () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  // 初始化和值变化时调整高度
  useEffect(() => {
    resizeTextareaHeight();
  }, [props.value, isPreview]);

  useEffect(() => {
    markdown(props.value).then((text) => setMarkdownText(text === '' ? '没有可预览' : text));
  }, [props.value]);

  if (!auth.state.user) {
    return null;
  }

  return (
    <div className={'flex flex-row items-start gap-4 mb-4 w-full text-mint-950 dark:text-mint-50 ' + props.className}>
      <img alt="头像" className="w-10 h-10 rounded-full cursor-default" src={auth.state.user?.avatar_url} />
      <div className="min-h-50 w-[calc(100%-56px)] flex flex-col">
        <div className="h-10 w-full flex flex-row items-center gap-4 cursor-default">
          <span>{props.parentComment ? '回复评论' : '添加评论'}</span>

          {props.parentComment ?
            <span className="text-sm text-mint-500 hover:text-mint-500/50">
              &gt;
            </span> :
            null
          }

          <span className="max-w-[30%] text-sm text-mint-500 overflow-hidden text-ellipsis whitespace-nowrap">
            {props.parentComment ? `${props.parentComment.content}` : ''}
          </span>

          {props.parentComment ?
            <span
              className="ml-auto text-sm text-mint-500 hover:text-mint-500/50 cursor-pointer"
              onClick={() => props.setParentComment(null)}
            >
              取消回复
            </span> :
            null
          }
        </div>
        {!isPreview ?
          <textarea
            className="markdown-editor min-h-40 w-full border border-mint-500
                      bg-[#ffffff] dark:bg-[#0e1116]
                      text-mint-950 dark:text-mint-50
                      placeholder:text-mint-500
                      focus:outline-none
                      focus:border-mint-500
                      rounded-md p-4 pb-[18px]"
            name="Markdown编辑器"
            onChange={props.onChange}
            placeholder="使用 Markdown 来格式化你的评论"
            ref={textareaRef}
            value={props.value}
          /> :
          <div
            className="markdown-body min-h-40 w-full border border-mint-500 rounded-md p-4"
            dangerouslySetInnerHTML={{ __html: markdownText }}
          />
        }
        {/* 按钮区域 */}
        <div className="flex justify-end gap-3 mt-4">
          <button
            className="px-4 py-2 text-sm font-medium rounded-md border border-mint-500 bg-mint-50 dark:bg-mint-950 hover:bg-mint-100 dark:hover:bg-mint-900 cursor-pointer"
            onClick={() => setIsPreview(!isPreview)}
            type="button"
          >
            {isPreview ? '编辑' : '预览'}
          </button>
          <button
            className="px-4 py-2 text-sm font-medium rounded-md bg-mint-500 text-mint-50 hover:bg-mint-500/80 cursor-pointer"
            onClick={props.onClick}
            type="submit"
          >
            评论
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentInput;
