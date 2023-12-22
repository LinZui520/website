import {motion} from "framer-motion";
import {useNavigate} from "react-router-dom";
import useFetchArticles from "../../hook/useFetchArticles";

const ArticlesMain = () => {

  const navigate = useNavigate()

  const {articles} = useFetchArticles()

  return (
    <div style={{
      width: '100vw', background: '#1d1d1f', minHeight: '100vh',
      display: 'flex', flexWrap: 'wrap',
      justifyContent: 'space-evenly', alignItems: 'center'
    }}>
      {articles.map(item =>
        <motion.div
          key={item.id}
          onClick={() => navigate('/article/' + item.id)}
          whileHover={{scale: 1.2}}
          whileTap={{scale: 0.9}}
          style={{
            background: '#fbfbfd', width: '30vw', height: '40vw',
            margin: '5vw', maxHeight: '350px', maxWidth: '300px',
            display: 'flex', flexDirection: 'column',
            justifyContent: 'flex-start', alignItems: 'center',
            cursor: 'pointer', borderRadius: '25px', padding: '5px 5px',
          }}
        >
          <h1 style={{fontSize: '32px', color: '#1d1d1f', marginBottom: '5vw'}}>{item.title}</h1>
          <div style={{fontSize: '24px', color: '#1d1d1f', marginBottom: '5vw'}}>作者：{item.username}</div>
          <div style={{fontSize: '24px', color: '#1d1d1f'}}>发表时间：</div>
          <div style={{fontSize: '24px', color: '#1d1d1f'}}>{new Date(item.create).toLocaleString()}</div>
        </motion.div>
      )}
    </div>
  );
}

export default ArticlesMain;