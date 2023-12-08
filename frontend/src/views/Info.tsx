import { useEffect } from "react";


const Info = () => {

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <div>
      <div style={{marginLeft: '10vw', marginRight: '10vw', height: '100vh', alignItems: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', fontSize: '2rem'}}>
        <span>朱贵是混蛋</span>
      </div>
    </div>
  );
}
  
export default Info;