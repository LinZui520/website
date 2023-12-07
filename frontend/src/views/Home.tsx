import { useSelector } from 'react-redux';

const Home = () => {

  const user = useSelector((state: any) => state.user);
  // console.log(user)
  
  return (
    <div>
      <div style={{marginLeft: '10vw', marginRight: '10vw', height: '100vh', alignItems: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', fontSize: '2rem'}}>
        <span>你好 世界</span>
        <span>朱贵是混蛋</span>
        {user.nickname}
      </div>

      <div style={{height: '100vh', alignItems: 'center', display: 'flex', justifyContent: 'center'}}>
        朱贵是混蛋
      </div>
      
    </div>
  );
}
  
export default Home;