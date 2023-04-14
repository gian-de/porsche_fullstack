import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
// const baseURL = "http://localhost:7777";
const apiEndpoint = process.env.NEXT_PUBLIC_API_ENDPOINT;

export const usePorscheData = (formData) => {
  const { data, isLoading, error } = useQuery(
    ["porscheData", formData],
    async () => {
      const params = {};
      // check to see if there is indeed a param inside specific formData option, if so add into params url request
      if (formData.model_name.length > 0) {
        params.model_name = formData.model_name
          .map((opt) => opt.value)
          .join(",");
      }

      if (formData.drivetrain.length > 0) {
        params.drivetrain = formData.drivetrain
          .map((opt) => opt.value)
          .join(",");
      }

      if (formData.engine_layout.length > 0) {
        params.engine_layout = formData.engine_layout
          .map((opt) => opt.value)
          .join(",");
      }

      const response = await axios.get(`${baseURL}${apiEndpoint}`, {
        params,
      });
      return response.data;
    },
    {
      // staleTime: infinity to limit calls to endpoint because i only want the endpoint to be called once per request and the data will never become stale because its static data
      staleTime: Infinity,
    }
  );

  return {
    porscheData: data,
    isLoading,
    error,
  };
};
// SELECT models.*, images.id AS image_id, images.image_type, images.image_path
// FROM models
// LEFT JOIN images ON models.id = images.model_id
// WHERE models.model_name IN (?,?) AND models.drivetrain IN (?,?) AND models.num_doors IN (?) AND models.year BETWEEN 2010 AND 2020
// ORDER BY models.year DESC;
