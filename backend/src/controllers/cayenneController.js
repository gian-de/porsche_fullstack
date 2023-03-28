import { getAllCayennes } from "../database.js";

export const getAllCayennesController = async (req, res) => {
  try {
    const data = await getAllCayennes();
    res.json(data);
  } catch (err) {
    console.error(err);
  }
};
