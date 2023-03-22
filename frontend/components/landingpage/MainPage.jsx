import { useState, useEffect } from "react";
import axios from "axios";

const MainPage = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchModelsData();
    return () => {};
  }, []);

  async function fetchModelsData() {
    try {
      const response = await axios.get("http://localhost:7777/api/porsche");
      console.log(response.data);
      setData(response.data);
    } catch (error) {
      console.error(error);
    }
  }
  return <p>main page data</p>;
};

export default MainPage;
