import { getAllCaymans } from "database.js";

export const getAllCaymansController = async (req, res) => {
  try {
    const data = await getAllCaymans();
    res.json(data);
  } catch (err) {
    console.error(err);
  }
};
