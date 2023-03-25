import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
const apiEndpoint = process.env.NEXT_PUBLIC_API_ENDPOINT;

export const usePorscheData = () => {
  const getPorscheData = async () => {
    const { data } = await axios.get(`${baseURL}${apiEndpoint}`);
    return data;
  };

  const {
    data: porscheData,
    isLoading: isLoadingPorscheData,
    error: errorPorscheData,
  } = useQuery(["porscheData"], getPorscheData);

  return { porscheData, isLoadingPorscheData, errorPorscheData };
};
