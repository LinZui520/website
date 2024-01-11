import Header from "../../components/memories/21/Header";
import First from "../../components/memories/21/First";
import useHandleWheelScroll from "../../hooks/useHandleWheelScroll";
import Second from "../../components/memories/21/Second";
import Third from "../../components/memories/21/Third";
import useHandleTouchScroll from "../../hooks/useHandleTouchScroll";


const ClassTwentyOne = () => {

  const {handleTouch} = useHandleTouchScroll()
  const {handleWheel} = useHandleWheelScroll()

  return (
    <div onTouchMove={handleTouch} onWheel={handleWheel}>
      <Header />
      <First />
      <Second />
      <Third />
    </div>
  );
}

export default ClassTwentyOne;