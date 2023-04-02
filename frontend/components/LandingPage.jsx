import { useState } from "react";
import Image from "next/image";
import Select from "react-select";
import { Disclosure } from "@headlessui/react";
import ChevronDown from "./svgs/ChevronDown";

import { usePorscheData } from "./hooks/usePorscheData";
import PorscheLogo from "../public/porsche-logo-compressed.png";

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
  // state for mobile menu
  const [menuOpen, setMenuOpen] = useState(false);

  const { porscheData, isLoading, error } = usePorscheData(formData);

  // state to filter data
  const [betweenOption, setBetweenOption] = useState("");
  const [minValue, setMinValue] = useState("");
  const [maxValue, setMaxValue] = useState("");
  // state for sorting data
  const [selectedSortOption, setSelectedSortOption] = useState(null);
  const [selectedSortDirection, setSelectedSortDirection] = useState(null);
  // state for sort dropdown to update when a sort option is selected by user
  const [selectedSortValue, setSelectedSortValue] = useState(null);

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
  const handleSortChange = (selectedOption) => {
    const values = selectedOption.value;
    const [sortOption, sortDirection] = values.split("-");
    if (values === "clear") {
      setSelectedSortOption(null);
      setSelectedSortDirection(null);
      setSelectedSortValue(null);
    } else {
      setSelectedSortOption(sortOption);
      setSelectedSortDirection(sortDirection);
    }
    // if-else to set the input state to null and doesnt show "Clear", for it to the show placeholder text
    if (selectedOption.value === "clear") {
      setSelectedSortValue(null);
    } else {
      setSelectedSortValue(selectedOption);
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
    setSelectedSortValue(null);
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

  const sortOptions = [
    { value: "price-asc", label: "Lowest Price" },
    { value: "price-desc", label: "Highest Price" },
    { value: "zero_to_sixty-asc", label: "0-60 mph (asc)" },
    { value: "zero_to_sixty-desc", label: "0-60 mph (desc)" },
    { value: "horsepower-asc", label: "Horsepower (asc)" },
    { value: "horsepower-desc", label: "Horsepower (desc)" },
    { value: "model_name-asc", label: "Alphabetical (a-z)" },
    { value: "model_name-desc", label: "Alphabetical (z-a)" },
    { value: "clear", label: "Clear" },
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
    <>
      <nav className="flex items-center justify-between p-3 bg-slate-300">
        <div className="flex items-center space-x-1 sm:space-x-3">
          <Image
            className="object-cover w-16 h-12 sm:w-20 sm:h-24"
            alt="Porsche Logo"
            src={PorscheLogo}
            priority
          />
          <h1 className="text-xl sm:text-2xl">"Mini-Wiki"</h1>
        </div>
      </nav>
      <div className="flex justify-between px-10 bg-green-400">
        <div className="flex flex-col max-w-md bg-yellow-300 rounded-sm">
          <Disclosure>
            {({ open }) => (
              <>
                <Disclosure.Button className="flex items-center justify-between px-4 py-2 space-x-2">
                  <span>Filter by...</span>
                  <ChevronDown className="w-2 h-2 " />
                </Disclosure.Button>
                <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm">
                  <form className="flex-col bg-green-300 w-fit lg:flex">
                    <div className="flex flex-col bg-blue-500 w-60">
                      <label htmlFor="select-models">
                        {"Select Models..."}
                      </label>
                      <div>
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
                    </div>
                    <div className="flex flex-col bg-blue-600 w-60">
                      <label htmlFor="select-drivetrain">
                        {"Select Drivetrains..."}
                      </label>
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
                    <div className="flex flex-col bg-blue-600 w-60">
                      <label htmlFor="select-engineLayout">
                        {"Select Engine Layout..."}
                      </label>
                      <Select
                        inputId="select-engineLayout"
                        isMulti
                        options={engineLayoutOptions}
                        onChange={handleEngineLayoutChange}
                        value={formData.engine_layout}
                        placeholder="Mid-Engine"
                        aria-labelledby="select-drivetrain-label"
                      />
                    </div>

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
                              placeholder="1985"
                            />
                            <span>-</span>
                            <input
                              type="text"
                              value={maxValue}
                              onChange={handleMaxValueChange}
                              placeholder="2023"
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
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
        </div>
        <div className="flex">
          {sortedData?.length === 1 ? null : (
            <Select
              className="text-sm w-36 whitespace-nowrap sm:w-40 sm:text-base"
              name="sort"
              options={sortOptions}
              onChange={handleSortChange}
              value={selectedSortValue}
              placeholder="Sort by..."
            />
          )}
        </div>
      </div>
      {newData &&
        newData?.map((item) => {
          const mainImg = item?.images?.filter(
            (image) => image.type === "Main"
          );
          const [mainImgSrc] = mainImg.map((image) => image.path);
          return (
            <div key={item.id}>
              <img className="w-60" src={mainImgSrc} alt="" />
              <p>{item.model_name}</p>
            </div>
          );
        })}
      {isLoading && <p>Loading...</p>}
      {!isLoading && newData?.length === 0 && (
        <p>Oops, no data that matches your search criteria available</p>
      )}
      {error && <p>Error: {error.message}</p>}
    </>
  );
};

export default LandingPage;

/* <form className="flex-col bg-green-300 w-fit lg:flex">
          <div className="flex flex-col bg-blue-500 w-60">
            <label htmlFor="select-models">{"Select Models..."}</label>
            <div>
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
          </div>
          <div className="flex flex-col bg-blue-600 w-60">
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
          <div className="flex flex-col bg-blue-600 w-60">
            <label htmlFor="select-engineLayout">
              {"Select Engine Layout..."}
            </label>
            <Select
              inputId="select-engineLayout"
              isMulti
              options={engineLayoutOptions}
              onChange={handleEngineLayoutChange}
              value={formData.engine_layout}
              placeholder="Mid-Engine"
              aria-labelledby="select-drivetrain-label"
            />
          </div>

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
            {/* render the inputs when the user selects an option aka true 
            {betweenOption ? (
              betweenOption?.value === "year" ? (
                <div className="bg-red-400 ">
                  <input
                    type="text"
                    value={minValue}
                    onChange={handleMinValueChange}
                    placeholder="1985"
                  />
                  <span>-</span>
                  <input
                    type="text"
                    value={maxValue}
                    onChange={handleMaxValueChange}
                    placeholder="2023"
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
          
          <div>
            <button
              className="px-5 py-2 bg-red-600 rounded-full"
              onClick={resetFilters}
            >
              Reset all Filters
            </button>
          </div>
        </form> */
