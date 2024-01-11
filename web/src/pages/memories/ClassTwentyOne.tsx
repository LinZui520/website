import Header from "../../components/memories/21/Header";
import First from "../../components/memories/21/First";
import useHandleWheel from "../../hooks/useHandleWheel";
import Second from "../../components/memories/21/Second";
import Third from "../../components/memories/21/Third";


const ClassTwentyOne = () => {

  const {handleWheel} = useHandleWheel()

  return (
    <div onWheel={handleWheel}>
      <Header />
      <First />
      <Second />
      <Third />
    </div>
  );
}

export default ClassTwentyOne;