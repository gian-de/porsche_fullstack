import axios from "axios";
import { useInfiniteQuery } from "@tanstack/react-query";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
const apiEndpoint = process.env.NEXT_PUBLIC_API_ENDPOINT;

export const usePorscheData = () => {
  const getPorscheData = async ({ pageParam = 1 }) => {
    const { data } = await axios.get(`${baseURL}${apiEndpoint}`, {
      params: { page: pageParam, per_page: 5 },
    });
    return data;
  };

  const {
    data: porscheData,
    isLoading: isLoadingPorscheData,
    error: errorPorscheData,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery(["porscheData"], getPorscheData, {
    getNextPageParam: (lastPage, pages) => {
      // check if there are more items to fetch
      return lastPage.hasMore ? pages.length + 1 : undefined;
    },
  });

  return {
    porscheData,
    isLoadingPorscheData,
    errorPorscheData,
    hasNextPage,
    fetchNextPage,
  };
};

// const getPorscheData = async () => {
//   const { data } = await axios.get(`${baseURL}${apiEndpoint}`);
//   return data}

// };
