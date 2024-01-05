import Header from "../../components/memories/21/Header";
import Main from "../../components/memories/21/Main";
import useHandleWheel from "../../hooks/useHandleWheel";
import React from "react";


const ClassTwentyOne = () => {

  const {handleWheel} = useHandleWheel()

  return (
    <div onWheel={handleWheel}>
      <Header />
      <Main />
    </div>
  );
}

export default ClassTwentyOne;