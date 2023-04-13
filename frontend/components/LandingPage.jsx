import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";

import Link from "next/link";
import Image from "next/image";
import Select from "react-select";
import { Disclosure } from "@headlessui/react";
import Navbar from "./Navbar";
import Modal from "./Modal";
import Pagination from "./Pagination";

import { usePorscheData } from "./hooks/usePorscheData";

import FilterIcon from "./svgs/FilterIcon";
import Xcircle from "./svgs/Xcircle";

// const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
// const baseURL = "http://localhost:7777";
// const apiEndpoint = process.env.NEXT_PUBLIC_API_ENDPOINT;

const LandingPage = () => {
  // state for form logic starts
  const [formData, setFormData] = useState({
    model_name: [],
    generation: [],
    trim_name: [],
    drivetrain: [],
    engine_layout: [],
  });

  const { porscheData, isLoading, error } = usePorscheData(formData);
  // state for modal when viewing a car
  const [selectedViewMore, setSelectedViewMore] = useState(null);

  // Pagination state and for latest data after filter/sort
  const ITEMS_PER_PAGE = 8;
  const [currentPage, setCurrentPage] = useState(0);
  const [latestData, setLatestData] = useState([]);

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
        setCurrentPage(0);
      }
    }
  };
  const handleMaxValueChange = (e) => {
    const newValue = e.target.value;
    if (newValue.length <= 7) {
      setMaxValue(e.target.value);
    }
    setCurrentPage(0);
  };

  const handleModelChange = (selectedOption) => {
    setFormData({ ...formData, model_name: selectedOption });
    setCurrentPage(0);
  };

  const handleDrivetrainChange = (selectedOption) => {
    setFormData({ ...formData, drivetrain: selectedOption });
    setCurrentPage(0);
  };

  const handleEngineLayoutChange = (selectedOption) => {
    setFormData({ ...formData, engine_layout: selectedOption });
    setCurrentPage(0);
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
      setCurrentPage(0);
    }
    // if-else to set the input state to null and doesnt show "Clear", for it to the show placeholder text but also show the current selected value as the "value" for option
    if (selectedOption.value === "clear") {
      setSelectedSortValue(null);
      setSelectedSortOption(null);
      setSelectedSortDirection(null);
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

  const handlePageChange = ({ selected: selectedPage }) => {
    setCurrentPage(selectedPage);
    window.scrollTo({ top: 100, behavior: "smooth", duration: 150 });
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
    // { value: "clear", label: "Clear Sort ↕" },
  ];

  const filteredData = useMemo(() => {
    return porscheData?.filter((car) => {
      if (betweenOption) {
        const { value } = betweenOption;
        return car[value] >= minValue && car[value] <= (maxValue || 3000000);
      }
      return true;
    });
  }, [betweenOption, minValue, maxValue, porscheData]);

  const sortedData = useMemo(() => {
    return filteredData?.sort((a, b) => {
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
  }, [
    filteredData,
    selectedSortOption,
    selectedSortDirection,
    selectedSortValue,
  ]);
  useEffect(() => {
    if (sortedData) {
      setLatestData(sortedData);
    } else {
      setLatestData(filteredData);
    }
  }, [filteredData, sortedData]);

  const getPaginatedData = () => {
    const startIndex = currentPage * ITEMS_PER_PAGE;
    return latestData?.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  };

  const paginatedData = getPaginatedData();

  const pageCount = Math.ceil(latestData?.length / ITEMS_PER_PAGE);

  // console.log("REACT_QUERY_DATA", porscheData);
  // console.log("sorted/filteredData", filteredData);
  // console.log("SORTEDDD", sortedData);
  // console.log("PAGINATED DATA", paginatedData);
  // console.log("latest DATA", latestData);

  return (
    <>
      <Navbar />
      <div className="flex items-start justify-between px-10 py-3 bg-slate-200 lg:px-20 lg:justify-end">
        <div className="flex flex-col max-w-xs text-sm text-gray-500 rounded-sm bg-slate-50 lg:hidden">
          <Disclosure>
            {({ open }) => (
              <>
                <Disclosure.Button
                  className={`flex items-center justify-between px-4 py-2 space-x-3 ${
                    open
                      ? ""
                      : "overflow-hidden rounded-sm ring-1 ring-gray-400/30"
                  }`}
                >
                  {open ? <span></span> : <h4>Filter by...</h4>}
                  {open ? <Xcircle /> : <FilterIcon />}
                </Disclosure.Button>
                <Disclosure.Panel className="px-4 pb-4 text-sm text-black">
                  <form className="flex-col w-56 -mt-4 space-y-4 lg:flex">
                    <div className="flex flex-col">
                      <label
                        className="pl-2 text-base w-fit"
                        htmlFor="select-models"
                      >
                        {"Models..."}
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
                    <div className="flex flex-col">
                      <label
                        className="pl-2 text-base w-fit"
                        htmlFor="select-drivetrain"
                      >
                        {"Drivetrains..."}
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
                    <div className="flex flex-col">
                      <label
                        className="pl-2 text-base w-fit"
                        htmlFor="select-engineLayout"
                      >
                        {"Engine Layout..."}
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
                    <div className="flex flex-col">
                      <label
                        className="pl-2 text-base w-fit"
                        htmlFor="select-filter"
                      >
                        More:
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
                          <div className="flex items-center justify-center mt-3 space-x-1">
                            <input
                              className="flex w-16 py-1 pl-2 border rounded-md border-slate-300"
                              type="text"
                              value={minValue}
                              onChange={handleMinValueChange}
                              placeholder="1985"
                            />
                            <span className="text-lg">-</span>
                            <input
                              className="flex w-16 py-1 pl-2 border rounded-md border-slate-300"
                              type="text"
                              value={maxValue}
                              onChange={handleMaxValueChange}
                              placeholder="2023"
                            />
                          </div>
                        ) : (
                          <div className="flex items-center justify-center mt-3 space-x-1">
                            <input
                              className="flex w-20 py-1 pl-2 border rounded-md border-slate-300"
                              type="text"
                              value={minValue}
                              onChange={handleMinValueChange}
                              placeholder="0"
                            />
                            <span className="text-lg">-</span>
                            <input
                              className="flex w-20 py-1 pl-2 border rounded-md border-slate-300"
                              type="text"
                              value={maxValue}
                              onChange={handleMaxValueChange}
                              placeholder="3,000,000"
                            />
                          </div>
                        )
                      ) : null}
                    </div>
                    {/* RESET ALL FILTER BUTTON */}
                    <div className="flex w-full mx-auto mt-4">
                      <button
                        className="flex px-5 py-2 mx-auto bg-red-600 rounded-full text-slate-200"
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
      <div className="flex">
        {/* form for lg screen size and up */}
        <div className="hidden bg-slate-200 lg:flex">
          <form className="flex flex-col w-64 px-6 pt-10 space-y-6 xl:w-80 xl:px-8">
            <div className="flex flex-col">
              <label className="pl-2 text-lg w-fit" htmlFor="select-models">
                {"Models..."}
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
            <div className="flex flex-col">
              <label className="pl-2 text-lg w-fit" htmlFor="select-drivetrain">
                {"Drivetrains..."}
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
            <div className="flex flex-col">
              <label
                className="pl-2 text-lg w-fit"
                htmlFor="select-engineLayout"
              >
                {"Engine Layout..."}
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
            <div className="flex flex-col">
              <label className="pl-2 text-lg w-fit" htmlFor="select-filter">
                More:
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
                  <div className="flex items-center justify-center mt-3 space-x-1">
                    <input
                      className="flex w-16 py-1 pl-2 border rounded-md border-slate-300"
                      type="text"
                      value={minValue}
                      onChange={handleMinValueChange}
                      placeholder="1985"
                    />
                    <span className="text-lg">-</span>
                    <input
                      className="flex w-16 py-1 pl-2 border rounded-md border-slate-300"
                      type="text"
                      value={maxValue}
                      onChange={handleMaxValueChange}
                      placeholder="2023"
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center mt-3 space-x-1">
                    <input
                      className="flex w-24 py-1 pl-2 border rounded-md border-slate-300"
                      type="text"
                      value={minValue}
                      onChange={handleMinValueChange}
                      placeholder="0"
                    />
                    <span className="text-lg">-</span>
                    <input
                      className="flex w-24 px-2 py-1 border rounded-md border-slate-300"
                      type="text"
                      value={maxValue}
                      onChange={handleMaxValueChange}
                      placeholder="3000000"
                    />
                  </div>
                )
              ) : null}
            </div>
            {/* RESET ALL FILTER BUTTON */}
            <div className="flex items-center justify-center pt-3">
              <button
                className="flex px-5 py-2 transition duration-150 bg-red-600 rounded-full hover:shadow-xl hover:-translate-x-1 hover:-translate-y-1 ease text-slate-100"
                onClick={resetFilters}
              >
                Reset all Filters
              </button>
            </div>
          </form>
        </div>

        {isLoading && (
          <p className="w-full px-20 py-10 text-xl -mr-80">Loading...</p>
        )}
        {!isLoading && filteredData?.length === 0 && (
          <p className="w-full px-20 py-10 text-xl -mr-80">
            Oops, no data that matches your search criteria available
          </p>
        )}
        {error && (
          <p className="w-full px-20 py-10 text-xl -mr-80">
            Error: {error.message}
          </p>
        )}

        <div className="flex items-center justify-center w-full p-10">
          <div className="grid gap-10 lg:gap-16 sm:grid-cols-2">
            {(sortedData || paginatedData) &&
              paginatedData?.map((item) => {
                const mainImg = item?.images?.filter(
                  (image) => image.type === "Main"
                );
                const [mainImgSrc] = mainImg.map((image) => image.path);

                return (
                  <motion.article
                    key={item.id}
                    className="flex flex-col overflow-hidden transition bg-black rounded-sm shadow-md ease hover:shadow-2xl text-slate-50 hover:scale-105"
                    transition={{
                      duration: 0.4,
                      ease: [0.6, 0.01, 0.05, 0.95],
                    }}
                  >
                    <div className="flex items-center flex-1 mx-auto">
                      <Image
                        width={380}
                        height={200}
                        className="object-contain"
                        src={mainImgSrc}
                        alt={`picture of ${item.year} ${item.model_name} ${item.trim_name}`}
                      />
                    </div>
                    <div className="flex flex-col items-center py-6 space-y-2 text-xl">
                      <p className="text-2xl">{item.year}</p>
                      <div className="flex space-x-2 text-3xl">
                        <p>{item.model_name}</p>
                        {/* filter out "Base" from info card */}
                        <p>
                          {item.trim_name === "Carrera GT" ||
                          item.trim_name === "Base"
                            ? null
                            : item.trim_name}
                        </p>
                      </div>
                      <p>{item.horsepower}hp</p>
                      <div className="flex space-x-2 text-lg">
                        <p>0 - 60 mph in</p>
                        <p>{item.zero_to_sixty} s</p>
                      </div>
                      <p className="text-yellow-400/90">
                        {item.price.toLocaleString("en-US", {
                          style: "currency",
                          currency: "USD",
                          minimumFractionDigits: 0,
                        })}
                      </p>
                      <button
                        onClick={() => setSelectedViewMore(item)}
                        className="text-base text-gray-400 underline"
                      >
                        view more
                      </button>
                      {/* <Link
                        className="text-base text-gray-400 underline"
                        href={`/${item.model_name}/${item.trim_name}/${item.year}`}
                      >
                        view more info...
                      </Link> */}
                    </div>
                  </motion.article>
                );
              })}
          </div>
        </div>
        <Modal
          selectedViewMore={selectedViewMore}
          setSelectedViewMore={setSelectedViewMore}
        />
      </div>

      {/* pagination buttons here */}
      {!isLoading && pageCount > 1 && (sortedData || paginatedData) && (
        <div className="bg-slate-200">
          <Pagination
            pageCount={pageCount}
            handlePageChange={handlePageChange}
            currentPage={currentPage}
          />
        </div>
      )}
    </>
  );
};

export default LandingPage;
