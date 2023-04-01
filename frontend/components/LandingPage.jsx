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
  // input state for filter

  const { porscheData, isLoading, error } = usePorscheData(formData);

  // state to filter data
  const [betweenOption, setBetweenOption] = useState("");
  const [minValue, setMinValue] = useState("");
  const [maxValue, setMaxValue] = useState("");
  // state for sorting data
  const [selectedSortOption, setSelectedSortOption] = useState(null);
  const [selectedSortDirection, setSelectedSortDirection] = useState(null);

  // start of "handleChange" functions
  const handleBetweenOptionChange = (selectedOption) => {
    setBetweenOption(selectedOption);
  };
  const handleMinValueChange = (e) => {
    // check that only numbers can be input values
    const regex = /^[0-9\b]+$/;
    // need to check it the length is 1 then on "Backspace", clear the input
    const newValue = e.target.value;
    if (regex.test(newValue) || e.keyCode === 8) {
      if (newValue.length === 1) {
        setMinValue(null);
      } else {
        setMinValue(newValue);
      }
    }
  };
  const handleMaxValueChange = (e) => {
    const newValue = e.target.value;
    if (newValue.length <= 7) {
      setMaxValue(e.target.value);
    }
  };

  const handleModelChange = (selectedOption) => {
    setFormData({ ...formData, model_name: selectedOption });
  };

  const handleDrivetrainChange = (selectedOption) => {
    setFormData({ ...formData, drivetrain: selectedOption });
  };

  const handleEngineLayoutChange = (selectedOption) => {
    setFormData({ ...formData, engine_layout: selectedOption });
  };
  const handleSortChange = (event) => {
    const { name, value } = event.target;
    if (name === "sort") {
      const [sortOption, sortDirection] = value.split("-");
      setSelectedSortOption(sortOption);
      setSelectedSortDirection(sortDirection);
    }
  };
  const resetFilters = (e) => {
    e.preventDefault();
    setFormData({
      model_name: [],
      generation: [],
      trim_name: [],
      drivetrain: [],
      engine_layout: [],
    });
    setSelectedSortOption(null);
    setSelectedSortDirection(null);
    setBetweenOption("");
    setMinValue("");
    setMaxValue("");
  };

  // defining the "schema" for the options in "Select"
  const modelOptions = [
    { value: "911", label: "911" },
    { value: "918", label: "918" },
    { value: "944", label: "944" },
    { value: "carrera gt", label: "Carrera GT" },
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
  const betweenOptions = [
    { value: "price", label: "Price" },
    { value: "weight", label: "Weight" },
    { value: "year", label: "Year" },
  ];
  // filter && sort functionality starts about here
  const newData = porscheData?.filter((car) => {
    if (betweenOption) {
      const { value } = betweenOption;
      // Filter cars based on selected option and min/max values
      return car[value] >= minValue && car[value] <= (maxValue || 3000000);
    }
    return true;
  });
  const sortedData = newData?.sort((a, b) => {
    if (!selectedSortOption) return 0;

    const aValue = a[selectedSortOption];
    const bValue = b[selectedSortOption];

    if (aValue < bValue) {
      return selectedSortDirection === "asc" ? -1 : 1;
    } else if (aValue > bValue) {
      return selectedSortDirection === "asc" ? 1 : -1;
    }
    return 0;
  });

  console.log("REACT_QUERY_DATA", porscheData);
  console.log("newdata", newData);

  return (
    <div>
      <form className="text-blue-600">
        <div>
          <div className="flex items-center mt-4">
            <label htmlFor="select-filter" className="mr-2">
              Filter By:
            </label>
            <Select
              inputId="select-filter"
              options={betweenOptions}
              onChange={handleBetweenOptionChange}
              value={betweenOption}
              placeholder="Price, Year"
              aria-labelledby="select-filters-label"
            />
            {/* render the inputs when the user selects an option aka true */}
            {betweenOption ? (
              betweenOption?.value === "year" ? (
                <div className="bg-red-400 ">
                  <input
                    type="text"
                    value={minValue}
                    onChange={handleMinValueChange}
                  />
                  <span>-</span>
                  <input
                    type="text"
                    value={maxValue}
                    onChange={handleMaxValueChange}
                  />
                </div>
              ) : (
                <div className=" bg-slate-200">
                  <input
                    type="text"
                    value={minValue}
                    onChange={handleMinValueChange}
                  />
                  <span>-</span>
                  <input
                    type="text"
                    value={maxValue}
                    onChange={handleMaxValueChange}
                  />
                </div>
              )
            ) : null}
          </div>
        </div>
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
        {sortedData?.length === 1 ? null : (
          <div className="">
            <select
              className="px-4 py-2 bg-blue-500 text-slate-200"
              name="sort"
              value={`${selectedSortOption}-${selectedSortDirection}`}
              onChange={handleSortChange}
            >
              <option value="">Sort by</option>
              <option value="price-asc">Price (low to high)</option>
              <option value="price-desc">Price (high to low)</option>
              <option value="zero_to_sixty-asc">0-60 mph (low to high)</option>
              <option value="zero_to_sixty-desc">0-60 mph (high to low)</option>
              <option value="horsepower-asc">Horsepower (low to high)</option>
              <option value="horsepower-desc">Horsepower (high to low)</option>
              <option value="model_name-asc">Alphabetical (a-z)</option>
              <option value="model_name-desc">Alphabetical (z-a)</option>
              <option value="clear">Clear</option>
            </select>
          </div>
        )}
        {/* RESET ALL FILTER BUTTON */}

        <div>
          <button
            className="px-5 py-2 bg-red-600 rounded-full"
            onClick={resetFilters}
          >
            Reset all Filters
          </button>
        </div>
      </form>
      {newData &&
        newData?.map((item) => (
          <div key={item.id}>
            <p>{item.model_name}</p>
          </div>
        ))}
      {isLoading && <p>Loading...</p>}
      {!isLoading && newData?.length === 0 && (
        <p>Oops, no data that matches your search criteria available</p>
      )}
      {error && <p>Error: {error.message}</p>}
    </div>
  );
};

export default LandingPage;

// filteredData.map((car) => {
//   console.log("inside FILTERED", car);

//   const mainImg = car.images.filter((image) => image.type === "Main");
//   const [mainImgSrc] = mainImg.map((item) => item.path);
//   console.log("src maybe", mainImg)})
