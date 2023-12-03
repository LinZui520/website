import { userLogin } from '../api/user'

const Home = () => {

  console.log(userLogin()) 

  return (
    <div>
      home
      <span>朱贵是混蛋</span>
      <div style={{height: '1200px'}}></div>
    </div>
  );
}
  
export default Home;