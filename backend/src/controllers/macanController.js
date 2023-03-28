import { getAllMacans } from "../database.js";

export const getAllMacansController = async (req, res) => {
  try {
    const data = await getAllMacans();
    res.json(data);
  } catch (err) {
    console.error(err);
  }
};
