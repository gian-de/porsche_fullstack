import { useState, useEffect } from "react";

import PorscheData from "../PorscheData";

const MainPage = () => {
  const [data, setData] = useState([]);

  return (
    <>
      <p>main page data</p>
      <PorscheData />
    </>
  );
};

export default MainPage;

// useEffect(() => {
//     fetchModelsData();
//     return () => {};
//   }, []);

//   async function fetchModelsData() {
//     try {
//       const response = await axios.get("http://localhost:7777/api/porsche");
//       console.log(response.data);
//       setData(response.data);
//     } catch (error) {
//       console.error(error);
//     }
//   }
