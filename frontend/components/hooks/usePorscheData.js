import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const apiEndpoint = "http://localhost:7777/api/porsche";

export const usePorscheData = () => {
  const getPorscheData = async () => {
    const { data } = await axios.get(apiEndpoint);
    return data;
  };

  const {
    data: porscheData,
    isLoading: isLoadingPorscheData,
    error: errorPorscheData,
  } = useQuery(["porscheData"], getPorscheData);

  return { porscheData, isLoadingPorscheData, errorPorscheData };
};
