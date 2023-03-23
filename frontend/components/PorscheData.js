import { useState } from "react";
import Select from "react-select";
import { usePorscheData } from "./hooks/usePorscheData";

const PorscheData = () => {
  const { porscheData, isLoadingPorscheData, errorPorscheData } =
    usePorscheData();

  const [selectedModel, setSelectedModel] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);

  if (isLoadingPorscheData) return <p>Loading...</p>;
  if (errorPorscheData) return <p>Error: {error.message}</p>;

  console.log("Line 19", porscheData);

  // Get all unique "sub data" choices to filter from
  const models = [...new Set(porscheData.map((car) => car.model_name))];
  const years = [...new Set(porscheData.map((car) => car.year))];

  // Filter the data based on selected model and year
  const filteredData = porscheData.filter(
    (car) =>
      (!selectedModel || car.model_name === selectedModel.value) &&
      (!selectedYear || car.year === selectedYear.value)
  );

  return (
    <div>
      <div className="text-gray-800">
        <Select
          options={models.map((model) => ({ value: model, label: model }))}
          value={selectedModel}
          onChange={setSelectedModel}
          placeholder="Select a model..."
        />
        <Select
          options={years.map((year) => ({ value: year, label: year }))}
          value={selectedYear}
          onChange={setSelectedYear}
          placeholder="Select a year..."
        />
      </div>
      <div>
        {filteredData.map((car) => (
          <p key={car.id}>
            {car.make}
            {car.model_name}
            {car.trim_name} ({car.model_name}, {car.year})
          </p>
        ))}
      </div>
    </div>
  );
};
export default PorscheData;
