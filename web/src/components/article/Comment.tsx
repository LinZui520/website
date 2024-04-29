import { motion } from "framer-motion";
import React, {useState} from "react";
import {useSelector} from "react-redux";
import {RootState} from "../../redux";
import useFetchCommentsByArticle from "../../hooks/comment/useFetchCommentsByArticle";
import {AddComment} from "../../api/comment";

interface CommentProps {
  article: number
}

const Comment: React.FC<CommentProps> = ({article}) => {

  const user = useSelector((state: RootState) => state.user)

  const { comments, fetchData } = useFetchCommentsByArticle(article)

  const [content, setContent] = useState("")

  const uploadComment = () => {
    if (user.id === 0) return
    if (content === "") return

    AddComment(article, content).then(res => {
      if (res.data.code === 200) {
        setContent("")
        fetchData().then(() => {})
      } else {
        setContent("error!")
      }
    }).catch(() => {
      setContent("error!")
    })
  }

  return (
    <div className={"w-[80vw] flex flex-col justify-center items-center"}>
      {user.id !== 0 && <div className={"w-[80vw] max-w-[800px] flex flex-row justify-between items-center mb-[32px]"}>
        <img
          src={`${window.location.origin}/image/${user.avatar}`} alt={""}
          className={"w-[48px] h-[48px] object-contain rounded-[8px] select-none"}
        />
        <motion.input
          placeholder="欢迎参与讨论"
          value={content} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setContent(e.target.value)}
          className={
            "max-w-[650px] w-[50vw] h-[48px] text-[16px] border-2 border-[#1f1f1d] rounded-[8px] outline-none select-none"
          }
          whileHover={{scale: 1.05}} whileTap={{scale: 0.95}} whileFocus={{scale: 1.05}}
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' ? uploadComment() : null}
        />
        <motion.button
          className={
            "w-[64px] h-[48px] text-[16px] border-2 border-[#1f1f1d] rounded-[8px] outline-none select-none"
          }
          whileHover={{scale: 1.05}} whileTap={{scale: 0.95}} whileFocus={{scale: 1.05}}
          onClick={() => uploadComment()}
        >
          发布
        </motion.button>
      </div>}

      <div className={"w-[80vw] max-w-[800px] border-2 border-[#1f1f1d] rounded-[8px] flex flex-col justify-between items-start"}>
        {comments.map(comment =>
          <div className={"w-[60vw] m-[16px] mb-[24px] flex flex-col justify-center items-start"}>
            <div className={"flex flex-row justify-center items-center"}>
              <img
                src={`${window.location.origin}/image/${comment.avatar}`} alt={""}
                className={"w-[32px] h-[32px] mr-[8px] object-contain rounded-[8px] select-none"}
              />

              <span>
                {comment.username}
              </span>
            </div>

            <span className={"font-bold text-[24px] text-[#1d1d1f]"}>
              {comment.content}
            </span>

            <span>
              {new Date(comment.create).toLocaleString()}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default Comment;