import { useState } from "react";
import Select from "react-select";

import { usePorscheData } from "./hooks/usePorscheData";

// const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
const baseURL = "http://localhost:7777";
const apiEndpoint = process.env.NEXT_PUBLIC_API_ENDPOINT;

const LandingPage = () => {
  const [formData, setFormData] = useState({
    model_name: [],
    generation: [],
    trim_name: [],
    drivetrain: [],
    engine_layout: [],
  });

  const { porscheData, isLoading, error } = usePorscheData(formData);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  // start of "handleChange" functions
  const handleModelChange = (selectedOption) => {
    setFormData({ ...formData, model_name: selectedOption });
  };

  const handleDrivetrainChange = (selectedOption) => {
    setFormData({ ...formData, drivetrain: selectedOption });
  };

  const handleEngineLayoutChange = (selectedOption) => {
    setFormData({ ...formData, engine_layout: selectedOption });
  };

  // defining the "schema" for the options in "Select"
  const modelOptions = [
    { value: "911", label: "911" },
    { value: "918", label: "918" },
    { value: "944", label: "944" },
    { value: "carrera%20gt", label: "Carrera GT" },
    { value: "cayenne", label: "Cayenne" },
    { value: "cayman", label: "Cayman" },
    { value: "macan", label: "Macan" },
    { value: "panamera", label: "Panamera" },
    { value: "taycan", label: "Taycan" },
  ];

  const drivetrainOptions = [
    { value: "AWD", label: "AWD" },
    { value: "RWD", label: "RWD" },
  ];

  const engineLayoutOptions = [
    { value: "Front-Engine", label: "Front-Engine" },
    { value: "Mid-Engine", label: "Mid-Engine" },
    { value: "Rear-Engine", label: "Rear-Engine" },
  ];

  return (
    <div>
      {console.log("inside jsx", porscheData)}
      <form className="text-blue-600">
        <div className="flex">
          <label htmlFor="select-models">{"Select Models..."}</label>
          <Select
            inputId="select-models"
            isMulti
            options={modelOptions}
            onChange={handleModelChange}
            value={formData.model_name}
            placeholder="Cayman, Taycan"
            aria-labelledby="select-models-label"
          />
        </div>
        <div className="flex">
          <label htmlFor="select-drivetrain">{"Select Drivetrains..."}</label>
          <Select
            inputId="select-drivetrain"
            isMulti
            options={drivetrainOptions}
            onChange={handleDrivetrainChange}
            value={formData.drivetrain}
            placeholder="AWD, RWD"
            aria-labelledby="select-drivetrain-label"
          />
        </div>
        <div className="flex">
          <label htmlFor="select-engineLayout">
            {"Select Engine Layout..."}
          </label>
          <Select
            inputId="select-engineLayout"
            isMulti
            options={engineLayoutOptions}
            onChange={handleEngineLayoutChange}
            value={formData.engine_layout}
            placeholder="Front-Engine, Mid-Engine"
            aria-labelledby="select-drivetrain-label"
          />
        </div>
      </form>
      {porscheData?.length > 0 ? (
        porscheData.map((item) => (
          <div key={item.id}>
            <p>{item.model_name}</p>
          </div>
        ))
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
};

export default LandingPage;

// filteredData.map((car) => {
//   console.log("inside FILTERED", car);

//   const mainImg = car.images.filter((image) => image.type === "Main");
//   const [mainImgSrc] = mainImg.map((item) => item.path);
//   console.log("src maybe", mainImg)})
