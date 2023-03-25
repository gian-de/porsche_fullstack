import { useState } from "react";
import Select from "react-select";
import { usePorscheData } from "./hooks/usePorscheData";

const PorscheData = () => {
  const { porscheData, isLoadingPorscheData, errorPorscheData } =
    usePorscheData();

  const [selectedModels, setSelectedModels] = useState([]);
  const [selectedGenerations, setSelectedGenerations] = useState(null);
  const [possibleGenerations, setPossibleGenerations] = useState(null);
  const [selectedSortOption, setSelectedSortOption] = useState(null);
  const [selectedSortDirection, setSelectedSortDirection] = useState(null);

  if (isLoadingPorscheData) return <p>Loading...</p>;
  if (errorPorscheData) return <p>Error: {error.message}</p>;

  console.log("Line 18", porscheData);

  // Get all unique "sub data" choices to filter from
  const allModels = porscheData.map((car) => car.model_name);
  const models = [...new Set(allModels)];

  // Filter the data based on selected model and generation
  const filteredData = porscheData.filter(
    (car) =>
      (!selectedModels?.length ||
        selectedModels.some((selected) => selected.value === car.model_name)) &&
      (!selectedGenerations?.length ||
        selectedGenerations.some(
          (selected) => selected.value === car.generation
        ))
  );

  // when a user clicks on a Model, then this function runs
  const getPossibleGenerations = (selectedModels) => {
    const possibleGenerations = porscheData
      .filter((car) =>
        selectedModels.some((selected) => selected.value === car.model_name)
      )
      .map((car) => car.generation);

    return [...new Set(possibleGenerations)];
  };

  // this function initially sets the 1st selected value to the 1st "selectedModel" variable, if there is one using nullish coalescing.
  const getGenerationOptions = () => {
    const selectedModel = selectedModels?.[0]?.value;

    if (!selectedModel) return [];

    // filters the 'porscheData' for matching 'model_name', then maps the resulting array to only include its corresponding 'generation'
    const allGenerations = porscheData
      .filter((car) => car.model_name === selectedModel)
      .map((car) => car.generation);
    // self-explanatory, creates new array with unique 'generations', then spreads to convert back into array
    const uniqueGenerations = [...new Set(allGenerations)];
    // maps the 'uniqueGenerations' array, where both the key&value is = generation value
    return uniqueGenerations.map((generation) => ({
      value: generation,
      label: generation,
    }));

    // this takes the selected models > filters 'porscheData' to extract unique 'generation' > mapped into an array of objects so it can be used as optiona for the dropdown menu
  };

  const handleModelChange = (selectedOptions) => {
    setSelectedModels(selectedOptions);
    setSelectedGenerations(null);
    setPossibleGenerations(getPossibleGenerations(selectedOptions));
  };

  const handleGenerationChange = (selectedOptions) => {
    setSelectedGenerations(selectedOptions);
  };

  const resetFilters = () => {
    setSelectedModels([]);
    setSelectedGenerations(null);
    setPossibleGenerations(null);
    setSelectedSortOption(null);
    setSelectedSortDirection(null);
  };

  // sort functionality starts

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "sort") {
      const [sortOption, sortDirection] = value.split("-");
      setSelectedSortOption(sortOption);
      setSelectedSortDirection(sortDirection);
    }
  };

  const sortedData = filteredData.sort((a, b) => {
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
  console.log("sorted Data", sortedData);

  return (
    <div>
      <div className="flex space-x-8 text-gray-800">
        <div className="flex-col">
          <Select
            options={models.map((model) => ({ value: model, label: model }))}
            value={selectedModels}
            onChange={handleModelChange}
            placeholder="Select model(s)..."
            isMulti={true}
          />
          {/* Render the Select dropdown only if there are more than one generation options available */}
          {selectedModels?.length === 1 &&
            getGenerationOptions().length > 1 && (
              <Select
                options={getGenerationOptions()}
                value={selectedGenerations}
                onChange={handleGenerationChange}
                placeholder="Select generation(s)..."
                isMulti={true}
              />
            )}
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
      </div>
      {/* Sort by Price/Horsepower/0-60 Select, don't render if there's only 1 option */}

      {sortedData.length === 1 ? null : (
        <div className="">
          <select
            className="px-4 py-2 bg-blue-500 text-slate-200"
            name="sort"
            value={`${selectedSortOption}-${selectedSortDirection}`}
            onChange={handleChange}
          >
            <option value="">Sort by</option>
            <option value="price-asc">Price (low to high)</option>
            <option value="price-desc">Price (high to low)</option>
            <option value="zero_to_sixty-asc">0-60 mph (low to high)</option>
            <option value="zero_to_sixty-desc">0-60 mph (high to low)</option>
            <option value="horsepower-asc">Horsepower (low to high)</option>
            <option value="horsepower-desc">Horsepower (high to low)</option>
            <option value="clear">Clear</option>
          </select>
        </div>
      )}
      <div>
        {filteredData.map((car) => {
          console.log(
            "inside map",
            car.images.filter((item) => item.type === "Main")
          );
          const mainImg = car.images.filter((image) => image.type === "Main");
          const [mainImgSrc] = mainImg.map((item) => item.path);
          console.log("src maybe", mainImgSrc);
          return (
            <p key={car.id}>
              <div>
                <img
                  src={mainImgSrc}
                  alt=""
                  className="flex object-cover w-20 h-20"
                />
              </div>
              {car.make}
              {car.model_name}
              {car.trim_name}
              <span className="px-2">{car.horsepower}</span>
              <span className="px-2">{car.zero_to_sixty}</span>
              <span className="px-2">{car.drivetrain}</span>
              <span className="px-2">{car.price}</span> ({car.model_name},{" "}
              {car.generation})
            </p>
          );
        })}
      </div>
    </div>
  );
};
export default PorscheData;
