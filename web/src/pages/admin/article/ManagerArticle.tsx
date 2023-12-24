import useFetchArticles from "../../../hook/useFetchArticles";
import ArticleTable from "../../../components/admin/article/ArticleTable";
import {useNavigate} from "react-router-dom";
import {message, Modal} from "antd";
import {useState} from "react";
import {DeleteArticle} from "../../../api/article";



const ManagerArticle = () => {

  const navigate = useNavigate()
  const {articles, fetchData} = useFetchArticles()


  const operate: {[key: string]: (id: number) => void} = {
    '删除': (id: number) => {
      setManager(() => () => {
        DeleteArticle(id).then(res => {
          if (res.data.code === 200) {
            messageApi.success(res.data.message).then(() => {
            })
            fetchData().then(() => {
            })
            setIsModalOpen(false)
          } else {
            messageApi.error(res.data.message).then(() => {
            })
          }
        }).catch(() => {
          messageApi.error("网络原因，删除失败").then(() => {
          })
        })
      })
      setTitle("确定删除该文章？")
      setIsModalOpen(true)
    },

    '修改': (id: number) => {
      setManager(() => () =>
        navigate('/admin/article/update/' + id)
      )
      setTitle("确定修改该文章？")
      setIsModalOpen(true)
    },

    '查看': (id: number) => {
      setManager(() => () => {
        navigate('/article/' + id)
      })
      setTitle("确定查看该文章？")
      setIsModalOpen(true)
    },
  }


  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("")
  const [manager, setManager] = useState<() => void>(() => () => {});
  const [messageApi, contextHolder] = message.useMessage()

  return (
    <div>
      {contextHolder}
      <Modal
        title={title}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => manager()}
      >
      </Modal>

      <ArticleTable
        operate={operate}
        articles={articles}
      />
    </div>
  );
}

export default ManagerArticle;