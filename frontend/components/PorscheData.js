import { useState } from "react";
import Select from "react-select";
import { usePorscheData } from "./hooks/usePorscheData";

const PorscheData = () => {
  const { porscheData, isLoadingPorscheData, errorPorscheData } =
    usePorscheData();

  const [selectedModels, setSelectedModels] = useState([]);
  const [selectedGenerations, setSelectedGenerations] = useState(null);
  const [possibleGenerations, setPossibleGenerations] = useState(null);

  if (isLoadingPorscheData) return <p>Loading...</p>;
  if (errorPorscheData) return <p>Error: {error.message}</p>;

  console.log("Line 19", porscheData);

  // Get all unique "sub data" choices to filter from
  const allModels = porscheData.map((car) => car.model_name);
  const models = [...new Set(allModels)];

  // Get all unique "sub data" choices to filter from
  const allGenerations = porscheData.map((car) => car.generation);
  const generations = [...new Set(allGenerations)];

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

  console.log("possible generations", possibleGenerations);

  return (
    <div>
      <div className="text-gray-800">
        <Select
          options={models.map((model) => ({ value: model, label: model }))}
          value={selectedModels}
          onChange={handleModelChange}
          placeholder="Select model(s)..."
          isMulti={true}
        />

        {/* Render the Select dropdown only if there are more than one generation options available */}
        {selectedModels?.length === 1 && getGenerationOptions().length > 1 && (
          <Select
            options={getGenerationOptions()}
            value={selectedGenerations}
            onChange={handleGenerationChange}
            placeholder="Select generation(s)..."
            isMulti={true}
          />
        )}
      </div>
      <div>
        {filteredData.map((car) => (
          <p key={car.id}>
            {car.make}
            {car.model_name}
            {car.trim_name}
            <span className="px-2">{car.horsepower}</span>
            <span className="px-2">{car.zero_to_sixty}</span>
            <span className="px-2">{car.drivetrain}</span>
            <span className="px-2">{car.price}</span> ({car.model_name},{" "}
            {car.generation})
          </p>
        ))}
      </div>
    </div>
  );
};
export default PorscheData;
