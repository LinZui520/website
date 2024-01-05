import Header from "../../components/memories/21/Header";
import First from "../../components/memories/21/First";
import useHandleWheel from "../../hooks/useHandleWheel";
import React from "react";
import Second from "../../components/memories/21/Second";


const ClassTwentyOne = () => {

  const {handleWheel} = useHandleWheel()

  return (
    <div onWheel={handleWheel}>
      <Header />
      <First />
      <Second />
    </div>
  );
}

export default ClassTwentyOne;