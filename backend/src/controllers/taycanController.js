import { getAllTaycans } from "../database";

export const getAllTaycansController = async (req, res) => {
  try {
    const data = await getAllTaycans();
    res.json(data);
  } catch (err) {
    console.error(err);
  }
};
