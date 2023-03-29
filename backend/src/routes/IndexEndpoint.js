import { queryAllModelsAndImagesByFilters } from "../database";

export const IndexEndpoint = async (req, res) => {
  try {
    const formattedParams = formatQueryParams(req.query);
    const data = await queryAllModelsAndImagesByFilters(formattedParams);
    res.json(data);
  } catch (err) {
    console.error(err);
  }
};

const formatQueryParams = (queryParams) => {
  const validProps = [
    "make",
    "model_name",
    "trim_name",
    "generation",
    "engine_layout",
    "drivetrain",
    "horsepower",
    "zero_to_sixty",
    "year",
    "price",
    "num_doors",
    "weight",
    "sort",
    "between",
  ];
  const formattedParams = {};
  let sqlWhereClause = [];
  let sqlParams = [];
  // converts "queryParams" into an easier to use Obj
  for (const [key, value] of Object.entries(queryParams)) {
    // check to see if params are whitelisted from "validProps" array options
    if (!validProps.includes(key)) {
      continue;
    }
    // if sort is in query, add a key named "sort" with the order and fields to an array that'll be called "sort" for sql statement in "database.js"
    // for example -- sort: { field: 'model_name', order: 'desc'}
    if (key === "sort") {
      const [field, order] = value.split(",");
      formattedParams.sort = { field, order };
    } else if (key === "between") {
      // seperate the values and field that user wants to filer by ("price", "13500-85200")
      const [option, nums] = value.split(",");
      // then split the num values by hyphen into variables ("13500", "85200")
      const [min, max] = nums.split("-");
      formattedParams.between = {
        field: option,
        values: [Number(min), Number(max)],
      };
      // end result looks like --- between: { price: [13500, 85200]}
    } else {
      formattedParams[key] = value.split(",");
    }
  }
  return formattedParams;
};
