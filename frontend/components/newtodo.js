import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

const baseURL = "http://localhost:7777";
const apiEndpoint = process.env.NEXT_PUBLIC_API_ENDPOINT;

export const usePorscheData = (page, pageSize, formData) => {
  const { data, isLoading, error } = useQuery(
    ["porscheData", page, pageSize, formData],
    async () => {
      const params = {
        _page: page,
        _limit: pageSize,
      };

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

      const response = await axios.get(`${baseURL}/api/porsche`, {
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

const LandingPage = () => {
  // state for form logic starts
  const [formData, setFormData] = useState({
    model_name: [],
    generation: [],
    trim_name: [],
    drivetrain: [],
    engine_layout: [],
  });

  // state for pagination logic starts
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const { porscheData, isLoading, error } = usePorscheData(
    page,
    pageSize,
    formData
  );

  return (
    <>
      {/* Your form logic goes here */}
      {/* ... */}
      {/* ... */}

      {/* Your table logic goes here */}
      {isLoading && <p>Loading data...</p>}
      {error && <p>Error fetching data: {error.message}</p>}
      {porscheData && (
        <>
          <table>
            <thead>
              <tr>
                <th>Model Name</th>
                <th>Generation</th>
                <th>Trim Name</th>
                <th>Drivetrain</th>
                <th>Engine Layout</th>
              </tr>
            </thead>
            <tbody>
              {porscheData.map((row) => (
                <tr key={row.id}>
                  <td>{row.model_name}</td>
                  <td>{row.generation}</td>
                  <td>{row.trim_name}</td>
                  <td>{row.drivetrain}</td>
                  <td>{row.engine_layout}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div>
            <button onClick={() => setPage(page - 1)} disabled={page === 1}>
              Previous
            </button>
            <button
              onClick={() => setPage(page + 1)}
              disabled={porscheData.length < pageSize}
            >
              Next
            </button>
          </div>
        </>
      )}
    </>
  );
};

export default LandingPage;
