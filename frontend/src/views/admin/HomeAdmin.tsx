import { Statistic } from "antd";

const HomeAdmin = () => {
  return (
    <div style={{width: '80vw', paddingTop: '30px'}}>
      <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly'}}>
        <Statistic title="用户总数" value={13} />
        <Statistic title="文章总数" value={345} />
        <Statistic title="留言总数" value={3493} />
      </div>

    </div>
  );
}

export default HomeAdmin;