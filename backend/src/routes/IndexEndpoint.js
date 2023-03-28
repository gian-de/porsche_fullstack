import { queryAllModelsAndImages } from "../database";
export const IndexEndpoint = async (req, res) => {
  try {
    const data = await queryAllModelsAndImages();
    res.json(data);
  } catch (err) {
    console.error(err);
  }
};
